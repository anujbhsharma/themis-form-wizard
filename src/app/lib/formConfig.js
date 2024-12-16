// formConfig.ts

export const CONSTANTS = {
  INCOME: {
    MIN_ANNUAL: 0,
    MAX_ANNUAL: 42000,
    PER_DEPENDENT: 5000
  },
  AGE: {
    MIN: 18,
    MAX: 85
  },
  HOUSEHOLD: {
    MAX_DEPENDENTS: 10,
    MIN_SIZE: 1,
    MAX_SIZE: 6
  }
};

export const MONTHLY_THRESHOLDS = {
  1: { income: 1900, assets: 5000 },
  2: { income: 2800, assets: 9000 },
  3: { income: 2900, assets: 10000 },
  4: { income: 3100, assets: 11000 },
  5: { income: 3300, assets: 12000 },
  6: { income: 3500, assets: 13000 }
};

export const RESOURCES = {
  shelters: [
    {
      name: "Oak Centre",
      location: "Fredericton",
      phoneNumber: "(506) 206-0667",
      category: "shelters"
    },
    {
      name: "Saint John House",
      location: "Fredericton",
      phoneNumber: "(506) 450-1102",
      category: "shelters"
    },
    {
      name: "Women in Transition",
      location: "Fredericton",
      phoneNumber: "(506) 459-2300",
      notes: "Women Only",
      category: "shelters"
    },
    {
      name: "Grace House for Women",
      phoneNumber: "(506) 450-3001",
      notes: "Women Only",
      category: "shelters"
    },
    {
      name: "Gignoo Transition House",
      phoneNumber: "(800) 565-6878",
      notes: "First Nations Women",
      category: "shelters"
    }
  ],
  legal: [
    {
      name: "Legal Aid New Brunswick",
      phoneNumber: "(506) 444-2777",
      category: "legal"
    },
    {
      name: "Law Society of New Brunswick",
      phoneNumber: "(506) 458-8540",
      category: "legal"
    }
  ],
  emergency: [
    {
      name: "Emergency Services",
      phoneNumber: "911",
      category: "emergency",
      description: "For immediate danger"
    },
    {
      name: "Mental Health Crisis Line",
      phoneNumber: "1-800-667-5005",
      category: "emergency",
      description: "24/7 crisis support"
    }
  ]
};

export const formConfig = {
  metadata: {
    version: "2.1.0",
    lastUpdated: "2024-12-06",
    clinic: {
      name: "UNB Legal Clinic",
      phone: "(506) 453-4547",
      email: "lawclinic@unb.ca",
      address: "41 Dineen Drive, Fredericton, NB"
    }
  },
  steps: [
    {
      id: "emergency",
      title: "Emergency Assessment",
      critical: true,
      icon: "AlertCircle",
      guidance: "Your safety is our primary concern. Please let us know if you need immediate assistance.",
      fields: [
        {
          name: "immediateRisk",
          label: "Are you in immediate danger?",
          type: "radio",
          required: true,
          critical: true,
          options: [
            { value: "yes", label: "Yes, I need immediate help" },
            { value: "no", label: "No, I am safe" }
          ],
          validation: {
            rules: [
              (value) => ({
                isValid: true,
                resources: value === "yes" ? RESOURCES.emergency : null,
                terminateIfInvalid: value === "yes"
              })
            ]
          }
        },
        {
          name: "shelterNeeded",
          label: "Do you need emergency shelter?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ],
          validation: {
            rules: [
              (value) => ({
                isValid: true,
                resources: value === "yes" ? RESOURCES.shelters : null
              })
            ]
          }
        }
      ]
    },
    {
      id: "consent",
      title: "Consent and Privacy",
      icon: "Shield",
      guidance: "Please review and accept our terms and privacy policy.",
      fields: [
        {
          name: "screeningConsent",
          label: "Screening Consent",
          type: "checkbox",
          required: true,
          guidance: "You must agree to be screened and provide necessary information",
          validation: {
            rules: [
              (value) => ({
                isValid: value === true,
                message: "Screening consent is required",
                terminateIfInvalid: true
              })
            ]
          }
        },
        {
          name: "privacyPolicy",
          label: "Privacy Policy",
          type: "checkbox",
          required: true,
          guidance: "We protect your information and handle it securely",
          validation: {
            rules: [
              (value) => ({
                isValid: value === true,
                message: "Privacy policy acceptance required",
                terminateIfInvalid: true
              })
            ]
          }
        }
      ]
    },
    {
      id: "personal",
      title: "Personal Information",
      icon: "User",
      guidance: "Please provide your personal information exactly as it appears on your ID.",
      requiredDocuments: ["Government Photo ID", "Proof of Address"],
      fields: [
        {
          name: "firstName",
          label: "Legal First Name",
          type: "text",
          required: true,
          validation: {
            rules: [
              (value) => ({
                isValid: /^[A-Za-z\s\-']{2,50}$/.test(value),
                message: "Please enter a valid first name"
              })
            ]
          }
        },
        {
          name: "lastName",
          label: "Legal Last Name",
          type: "text",
          required: true,
          validation: {
            rules: [
              (value) => ({
                isValid: /^[A-Za-z\s\-']{2,50}$/.test(value),
                message: "Please enter a valid last name"
              })
            ]
          }
        },
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          required: true,
          guidance: "Must be 18 or older to use our services",
          validation: {
            rules: [
              (value) => {
                const age = calculateAge(value);
                return {
                  isValid: age >= CONSTANTS.AGE.MIN && age <= CONSTANTS.AGE.MAX,
                  message: `Age must be between ${CONSTANTS.AGE.MIN} and ${CONSTANTS.AGE.MAX}`
                };
              }
            ]
          }
        },
        {
          name: "indigenous",
          label: "Do you identify as Indigenous?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            { value: "prefer-not-to-say", label: "Prefer not to say" }
          ]
        }
      ]
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: "Phone",
      guidance: "Please provide reliable contact methods where we can reach you.",
      fields: [
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          required: true,
          guidance: "Primary phone number where we can reach you",
          validation: {
            rules: [
              (value) => ({
                isValid: /^\+?1?\d{10}$/.test(value.replace(/\D/g, '')),
                message: "Please enter a valid 10-digit phone number"
              })
            ]
          }
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          guidance: "For sending documents and updates",
          validation: {
            rules: [
              (value) => ({
                isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: "Please enter a valid email address"
              })
            ]
          }
        },
        {
          name: "address",
          label: "Current Address",
          type: "textarea",
          required: true,
          guidance: "Must be within our service area",
          validation: {
            rules: [
              (value) => ({
                isValid: value.length >= 10,
                message: "Please enter your complete address"
              })
            ]
          }
        }
      ]
    },
    {
      id: "household",
      title: "Household Information",
      icon: "Home",
      guidance: "Tell us about your household composition for income assessment.",
      fields: [
        {
          name: "householdSize",
          label: "Total Household Size",
          type: "number",
          required: true,
          guidance: "Include yourself, spouse/partner, and dependents",
          validation: {
            rules: [
              (value) => ({
                isValid: value >= CONSTANTS.HOUSEHOLD.MIN_SIZE && value <= CONSTANTS.HOUSEHOLD.MAX_SIZE,
                message: `Household size must be between ${CONSTANTS.HOUSEHOLD.MIN_SIZE} and ${CONSTANTS.HOUSEHOLD.MAX_SIZE}`
              })
            ]
          }
        },
        {
          name: "dependents",
          label: "Number of Dependents",
          type: "number",
          required: true,
          guidance: "Children under 18 and qualifying adult dependents",
          validation: {
            rules: [
              (value, formData) => ({
                isValid: value >= 0 && value < formData.householdSize,
                message: "Number of dependents must be less than household size"
              })
            ]
          }
        }
      ]
    },
    {
      id: "financial",
      title: "Financial Information",
      icon: "DollarSign",
      guidance: "Please provide accurate financial information for eligibility assessment.",
      requiredDocuments: ["Income Statements", "Tax Assessment", "Proof of Benefits"],
      fields: [
        {
          name: "incomeType",
          label: "Income Sources",
          type: "checkbox-group",
          required: true,
          options: [
            { value: "employment", label: "Employment Income" },
            { value: "self-employment", label: "Self-Employment Income" },
            { value: "pension", label: "Pension/CPP/OAS" },
            { value: "ei", label: "Employment Insurance" },
            { value: "social-assistance", label: "Social Assistance" },
            { value: "other", label: "Other Income" }
          ]
        },
        {
          name: "monthlyIncome",
          label: "Total Monthly Income",
          type: "number",
          required: true,
          guidance: "Combined household income before deductions",
          validation: {
            rules: [
              (value, formData) => {
                const threshold = MONTHLY_THRESHOLDS[formData.householdSize]?.income || MONTHLY_THRESHOLDS[6].income;
                return {
                  isValid: value <= threshold,
                  message: `Monthly income must be below $${threshold} for your household size`
                };
              }
            ]
          }
        },
        {
          name: "assets",
          label: "Total Assets",
          type: "number",
          required: true,
          guidance: "Include savings, property, vehicles, investments",
          validation: {
            rules: [
              (value, formData) => {
                const threshold = MONTHLY_THRESHOLDS[formData.householdSize]?.assets || MONTHLY_THRESHOLDS[6].assets;
                return {
                  isValid: value <= threshold,
                  message: `Total assets must be below $${threshold} for your household size`
                };
              }
            ]
          }
        }
      ]
    },
    {
      id: "legal",
      title: "Legal Matter",
      icon: "Scale",
      guidance: "Describe your legal issue so we can determine if we can help.",
      fields: [
        {
          name: "legalIssueType",
          label: "Type of Legal Issue",
          type: "select",
          required: true,
          options: [
            { value: "social-benefits", label: "Social Benefits" },
            { value: "housing", label: "Housing/Tenant Rights" },
            { value: "employment", label: "Employment" },
            { value: "human-rights", label: "Human Rights" },
            { value: "small-claims", label: "Small Claims" },
            { value: "immigration", label: "Immigration" }
          ]
        },
        {
          name: "description",
          label: "Issue Description",
          type: "textarea",
          required: true,
          guidance: "Provide details about your legal issue",
          validation: {
            rules: [
              (value) => ({
                isValid: value.length >= 100,
                message: "Please provide more detail about your legal issue"
              })
            ]
          }
        },
        {
          name: "existingDocuments",
          label: "Do you have any existing legal documents related to this matter?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        }
      ]
    }
  ]
};

// Utility function for age calculation
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}