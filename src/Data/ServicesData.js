const servicesList = [
  { value: 'MSME Certificate', label: 'MSME Certificate' },
  { value: 'GIG', label: 'GIG' },
  { value: 'CGTMSE', label: 'CGTMSE' },
  { value: 'Tide 2.0', label: 'Tide 2.0' },
  { value: 'RKVY RAFTAAR', label: 'RKVY RAFTAAR' },
  { value: 'PMEGP', label: 'PMEGP', disabled: true }, // Disabled option
  { value: 'SEED SUPPORT SCHEME', label: 'SEED SUPPORT SCHEME (SSS)' },
  { value: 'UDYAM CERTIFICATION', label: 'UDYAM CERTIFICATION' },
  { value: 'ISO CERTIFICATION', label: 'ISO CERTIFICATION' },
  { value: 'MSME LOAN', label: 'MSME LOAN' },
  { value: 'PITCH DECK', label: 'PITCH DECK' },
  { value: 'SEED FUND', label: 'SEED FUND' },
  { value: 'NAIFF', label: 'NAIFF' },
  { value: 'WEBSITE DEVELOPMENT', label: 'WEBSITE DEVELOPMENT' },
  { value: 'UNIVERSAL GRANT', label: 'UNIVERSAL GRANT' },
  { value: 'SISFS', label: 'SISFS' },
  { value: 'NGO GROWTH FUND', label: 'NGO GROWTH FUND' },
  { value: 'JANSAMARTH', label: 'JANSAMARTH' },
  { value: 'Enterprise Leap 2.0', label: 'Enterprise Leap 2.0' },
  { value: 'TAX EXEMPTION', label: 'TAX EXEMPTION' },
  { value: 'SC ST FINANCIAL ASSISTANCE', label: 'SC ST FINANCIAL ASSISTANCE' },
  { value: 'NGO ELEVATION PROGRAM', label: 'NGO ELEVATION PROGRAM' },
  { value: 'NON PROFIT AGRI SOLUTIONS GRANT', label: 'NON PROFIT AGRI SOLUTIONS GRANT' },
  { value: 'SMALL BUSINESS INNOVATION GRANT', label: 'SMALL BUSINESS INNOVATION GRANT' },
  // { value: 'SUSTAINABLE IMPACT', label: 'SUSTAINABLE IMPACT' },
  { value: 'Standup India', label: 'Standup India' },
  { value: 'Mudra loan', label: 'Mudra loan' },
  { value: 'YOUNG INNOVATORS GRANT', label: 'YOUNG INNOVATORS GRANT' },
  { value: 'PATHFINDER GRANT', label: 'PATHFINDER GRANT' },
  { value: 'GRANT FOR TEXTILE', label: 'GRANT FOR TEXTILE' },
  { value: 'MEDTECH INNOVATIONS', label: 'MEDTECH INNOVATIONS' },
  { value: 'DEBT/EQUITY BASED SCHEMES', label: 'DEBT/EQUITY BASED SCHEMES' },
  { value: 'STARTUP ACCELERATOR', label: 'STARTUP ACCELERATOR' },
  { value: 'PROJECT REPORT', label: 'PROJECT REPORT' },
  { value: 'Nidhi Prayas Grant', label: 'Nidhi Prayas Grant' },
  { value: 'Company Incorporation', label: 'Company Incorporation' },
  { value: 'Startup Certificate', label: 'Startup Certificate' },
  { value: 'Private Investor', label: 'Private Investor' },
  { value: 'Ngo upliftment grants', label: 'Ngo upliftment grants' },
  { value: 'Pathfinder', label: 'Pathfinder' },
  { value: 'Progressive impact grants ', label: 'Progressive impact grants' },
  {value:'Mudra Loan',label:'Mudra Loan'},
  
  
  // New Services added as per request
  { value: '12A Registration', label: '12A Registration' },
  { value: 'Leap Fund 1cr', label: 'Leap Fund 1cr' },
  { value: '80G Registration', label: '80G Registration' },
  { value: 'CSR-1 Registration', label: 'CSR-1 Registration' },
  { value: 'Niti Ayog Registration', label: 'Niti Ayog Registration' },
  { value: 'NGO Darpan', label: 'NGO Darpan' },
  { value: 'GST Registration', label: 'GST Registration' },
  { value: 'Tan registration', label: 'Tan Registration' },
  { value: 'Pan Registration', label: 'Pan Registration' },
  { value: 'FSSAI Registration', label: 'FSSAI Registration' },
  { value: 'FSSAI State License- Trading', label: 'FSSAI State License- Trading' },
  { value: 'FSSAI State License- Mfg/Repack', label: 'FSSAI State License- Mfg/Repack' },
  { value: 'FSSAI Central License', label: 'FSSAI Central License' },
  { value: 'Udyam registration', label: 'Udyam Registration' },
  { value: 'Drug License-Retail', label: 'Drug License-Retail' },
  { value: 'Drug License-Wholesale', label: 'Drug License-Wholesale' },
  { value: 'Drug License-Manufacturing', label: 'Drug License-Manufacturing' },
  { value: 'Drug License- Loan License', label: 'Drug License- Loan License' },
  { value: 'Drug License- Import', label: 'Drug License- Import' },
  { value: 'Drug License- Multi', label: 'Drug License- Multi' },
  { value: 'Trademark Registration- Individual/SME', label: 'Trademark Registration- Individual/SME' },
  { value: 'Trademark Registration- Other', label: 'Trademark Registration- Other' },
  { value: 'International Trademark registration', label: 'International Trademark registration' },
  { value: 'Digital Signature Class-III (Signature only)', label: 'Digital Signature Class-III (Signature only)' },
  { value: 'Digital Signature with Encryption Class-III (Signature only)', label: 'Digital Signature with Encryption Class-III (Signature only)' },
  { value: 'Digital Signature Class-III (With Token)', label: 'Digital Signature Class-III (With Token)' },
  { value: 'Digital Signature with encryption Class-III (With Token)', label: 'Digital Signature with encryption Class-III (With Token)' },
  { value: 'Start-up India Registration with Organisation DSC', label: 'Start-up India Registration with Organisation DSC' },
  { value: 'Start-up India Registration without Organisation DSC', label: 'Start-up India Registration without Organisation DSC' }
];




const syncServices = async () => {
  try {
    // Fetch services from the backend
    const response = await fetch('https://crm-backend-6kqk.onrender.com/services/api/services');
    if (!response.ok) {
      throw new Error('Failed to fetch services from the backend');
    }

    const fetchedServices = await response.json();

    // Find missing services
    const missingServices = fetchedServices.filter(
      (service) =>
        !servicesList.some((localService) => localService.value === service.value)
    );

    // Append missing services to the local list
    if (missingServices.length > 0) {
      servicesList.push(...missingServices);
      console.log('Missing services appended:', missingServices);
    } else {
      console.log('No missing services found');
    }
  } catch (error) {
    console.error('Error syncing services:', error);
  }
};

// Call the function to sync services
syncServices();



export default servicesList;
