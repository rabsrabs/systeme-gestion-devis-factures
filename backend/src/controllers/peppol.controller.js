const { Facture, Client } = require('../models');

// Générer le XML UBL 2.1 pour PEPPOL
const generateUBLInvoice = (facture, client) => {
  const dateEmission = new Date(facture.date_emission).toISOString().split('T')[0];
  const dateEcheance = new Date(facture.date_echeance).toISOString().split('T')[0];
  
  // Ligne par défaut basée sur le montant total
  const ligneXML = `
    <cac:InvoiceLine>
      <cbc:ID>1</cbc:ID>
      <cbc:InvoicedQuantity unitCode="EA">1</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="EUR">${parseFloat(facture.montant_ht || 0).toFixed(2)}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Description>Installation panneaux solaires - ${facture.numero_facture}</cbc:Description>
        <cbc:Name>Prestation solaire</cbc:Name>
        <cac:ClassifiedTaxCategory>
          <cbc:ID>S</cbc:ID>
          <cbc:Percent>21</cbc:Percent>
          <cac:TaxScheme>
            <cbc:ID>VAT</cbc:ID>
          </cac:TaxScheme>
        </cac:ClassifiedTaxCategory>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="EUR">${parseFloat(facture.montant_ht || 0).toFixed(2)}</cbc:PriceAmount>
      </cac:Price>
    </cac:InvoiceLine>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  
  <!-- PEPPOL BIS Billing 3.0 -->
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>
  
  <cbc:ID>${facture.numero_facture}</cbc:ID>
  <cbc:IssueDate>${dateEmission}</cbc:IssueDate>
  <cbc:DueDate>${dateEcheance}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode>
  
  <!-- Vendeur (Anneessens & Co) -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0208">0123456789</cbc:EndpointID>
      <cac:PartyIdentification>
        <cbc:ID schemeID="0208">BE0123456789</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name>Anneessens &amp; Co</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>Rue des Panneaux Solaires 42</cbc:StreetName>
        <cbc:CityName>Bruxelles</cbc:CityName>
        <cbc:PostalZone>1000</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>BE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>BE0123456789</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>Anneessens &amp; Co SPRL</cbc:RegistrationName>
        <cbc:CompanyID schemeID="0208">BE0123456789</cbc:CompanyID>
      </cac:PartyLegalEntity>
      <cac:Contact>
        <cbc:Name>Service Facturation</cbc:Name>
        <cbc:Telephone>+32 2 123 45 67</cbc:Telephone>
        <cbc:ElectronicMail>facturation@anneessens.be</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingSupplierParty>
  
  <!-- Client -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cbc:EndpointID schemeID="0208">${client?.numero_tva || 'N/A'}</cbc:EndpointID>
      <cac:PartyIdentification>
        <cbc:ID>${client?.id_client || 'N/A'}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name>${client?.nom || 'Client'} ${client?.prenom || ''}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${client?.adresse || 'N/A'}</cbc:StreetName>
        <cbc:CityName>${client?.ville || 'N/A'}</cbc:CityName>
        <cbc:PostalZone>${client?.code_postal || '0000'}</cbc:PostalZone>
        <cac:Country>
          <cbc:IdentificationCode>BE</cbc:IdentificationCode>
        </cac:Country>
      </cac:PostalAddress>
      ${client?.numero_tva ? `<cac:PartyTaxScheme>
        <cbc:CompanyID>${client.numero_tva}</cbc:CompanyID>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>` : ''}
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${client?.nom || 'Client'} ${client?.prenom || ''}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
      <cac:Contact>
        <cbc:Name>${client?.prenom || ''} ${client?.nom || ''}</cbc:Name>
        <cbc:Telephone>${client?.telephone || 'N/A'}</cbc:Telephone>
        <cbc:ElectronicMail>${client?.email || 'N/A'}</cbc:ElectronicMail>
      </cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>
  
  <!-- Moyens de paiement -->
  <cac:PaymentMeans>
    <cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>
    <cbc:PaymentID>${facture.numero_facture}</cbc:PaymentID>
    <cac:PayeeFinancialAccount>
      <cbc:ID>BE68539007547034</cbc:ID>
      <cbc:Name>Anneessens &amp; Co</cbc:Name>
      <cac:FinancialInstitutionBranch>
        <cbc:ID>KREDBEBB</cbc:ID>
      </cac:FinancialInstitutionBranch>
    </cac:PayeeFinancialAccount>
  </cac:PaymentMeans>
  
  <!-- Conditions de paiement -->
  <cac:PaymentTerms>
    <cbc:Note>Paiement à 30 jours</cbc:Note>
  </cac:PaymentTerms>
  
  <!-- Totaux TVA -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="EUR">${parseFloat(facture.montant_tva || 0).toFixed(2)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="EUR">${parseFloat(facture.montant_ht || 0).toFixed(2)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="EUR">${parseFloat(facture.montant_tva || 0).toFixed(2)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>21</cbc:Percent>
        <cac:TaxScheme>
          <cbc:ID>VAT</cbc:ID>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  
  <!-- Totaux document -->
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="EUR">${parseFloat(facture.montant_ht || 0).toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="EUR">${parseFloat(facture.montant_ht || 0).toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="EUR">${parseFloat(facture.montant_ttc || 0).toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="EUR">${parseFloat(facture.montant_ttc || 0).toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  
  <!-- Lignes de facture -->
  ${ligneXML}
  
</Invoice>`;
};

// GET - Générer XML PEPPOL pour une facture
exports.generatePeppolXML = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facture = await Facture.findByPk(id, {
      include: [{ model: Client, as: 'Client' }]
    });
    
    if (!facture) {
      return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }
    
    const xml = generateUBLInvoice(facture, facture.Client);
    
    res.set('Content-Type', 'application/xml');
    res.set('Content-Disposition', `attachment; filename="PEPPOL_${facture.numero_facture}.xml"`);
    res.send(xml);
    
  } catch (error) {
    console.error('Erreur PEPPOL:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST - Simuler envoi PEPPOL
exports.sendPeppol = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facture = await Facture.findByPk(id, {
      include: [{ model: Client, as: 'Client' }]
    });
    
    if (!facture) {
      return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }
    
    // Simulation d'envoi PEPPOL (délai réaliste)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Générer un ID de transaction PEPPOL fictif
    const peppolTransactionId = `PEPPOL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Mettre à jour la facture avec les infos PEPPOL
    await facture.update({
      notes: `${facture.notes || ''}\n[PEPPOL] Envoyé le ${new Date().toLocaleString('fr-FR')} - ID: ${peppolTransactionId}`.trim()
    });
    
    res.json({
      success: true,
      message: 'Facture envoyée via PEPPOL avec succès',
      data: {
        transactionId: peppolTransactionId,
        timestamp: new Date().toISOString(),
        recipient: facture.Client?.email,
        status: 'DELIVERED',
        network: 'PEPPOL BIS Billing 3.0'
      }
    });
    
  } catch (error) {
    console.error('Erreur envoi PEPPOL:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET - Vérifier statut PEPPOL
exports.getPeppolStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const facture = await Facture.findByPk(id);
    
    if (!facture) {
      return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    }
    
    const isPeppolSent = facture.notes && facture.notes.includes('[PEPPOL]');
    
    res.json({
      success: true,
      data: {
        sent: isPeppolSent,
        details: isPeppolSent ? facture.notes : null
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
