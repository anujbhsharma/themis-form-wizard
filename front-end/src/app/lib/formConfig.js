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
    version: "2.2.0",
    lastUpdated: "2024-12-06",
    clinic: {
      name: "UNB Legal Clinic",
      phone: "(506) 452-6313",
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
                (value) => {
                  if (value === "yes") {
                    return {
                      isValid: true,
                      resources: RESOURCES.emergency,
                      terminateIfInvalid: true
                    };
                  }
                  return { isValid: true };
                }
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
                (value, formData) => {
                  // If they need shelter, show both emergency and shelter resources
                  if (value === "yes") {
                    const combinedResources = [
                      ...(formData.immediateRisk === "yes" ? RESOURCES.emergency : []),
                      ...RESOURCES.shelters
                    ];
                    return {
                      isValid: true,
                      resources: combinedResources
                    };
                  }
                  // If they're in danger but don't need shelter, keep showing emergency resources
                  if (formData.immediateRisk === "yes") {
                    return {
                      isValid: true,
                      resources: RESOURCES.emergency
                    };
                  }
                  return { isValid: true };
                }
              ]
            }
          }
        ]
      
    },
    {
      id: "disclaimers",
      title: "Disclaimers and Consent",
      icon: "FileText",
      critical: true,
      fields: [
        {
          name: "intakeDisclaimer",
          label: "Intake Disclaimer",
          type: "radio",
          required: true,
          options: [
            { value: "agree", label: "I agree" },
            { value: "disagree", label: "I do not agree" }
          ],
          validation: {
            rules: [
              (value) => ({
                isValid: value === "agree",
                message: "You must agree to continue",
                
              })
            ]
          }
        },
        {
          name: "emailCommunicationConsent",
          label: "Email Communication Authorization",
          type: "radio",
          required: true,
          options: [
            { value: "accept", label: "I accept" },
            { value: "decline", label: "I decline" }
          ],
          validation: {
            rules: [
              (value) => ({
                isValid: value === "accept",
                message: "You must accept email communication to continue",
               
              })
            ]
          }
        }
      ]
    },
    {
      id: "demographic",
      title: "Demographic Information",
      icon: "User",
      fields: [
        {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true
        },
        {
          name: "middleName",
          label: "Middle Name",
          type: "text",
          required: false
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true
        },
        {
          name: "address",
          label: "Address",
          type: "text",
          required: true
        },
        {
          name: "cityProvince",
          label: "City/Province",
          type: "text",
          required: true
        },
        {
          name: "postalCode",
          label: "Postal Code",
          type: "text",
          required: true,
          validation: {
            rules: [
              (value) => ({
                isValid: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value),
                message: "Please enter a valid postal code"
              })
            ]
          }
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          required: true
        },
        {
          name: "phoneType",
          label: "This phone number is my",
          type: "radio",
          required: true,
          options: [
            { value: "home", label: "Home phone number" },
            { value: "work", label: "Work phone number" },
            { value: "cell", label: "Cell phone number" }
          ]
        },
        {
          name: "phoneMessagePermission",
          label: "If we call and someone else answers, can we tell the person who answers that we are calling from the UNB Legal Clinic?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        {
          
            name: "dateOfBirth",
            label: "Date of Birth",
            type: "date",
            required: true,
            guidance: `Must be between ${CONSTANTS.AGE.MIN} and ${CONSTANTS.AGE.MAX} years old`,
            validation: {
              rules: [
                (value) => {
                  if (!value) return { isValid: false, message: "Date of Birth is required" };
                  
                  const today = new Date();
                  const birthDate = new Date(value);
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                  }
          
                  return {
                    isValid: age >= CONSTANTS.AGE.MIN && age <= CONSTANTS.AGE.MAX,
                    message: `Age must be between ${CONSTANTS.AGE.MIN} and ${CONSTANTS.AGE.MAX} years`
                  };
                }
              ]
            }
          
        },
        {
          name: "gender",
          label: "Gender",
          type: "radio",
          required: true,
          options: [
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
            { value: "nonbinary", label: "Non-binary" },
            { value: "prefer-not-to-say", label: "Prefer not to say" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "indigenous",
          label: "Do you identify as an Indigenous person?",
          type: "radio",
          required: true,
          options: [
            { value: "first-nations", label: "Yes, First Nations (e.g., Mi'kmaq or Wolastoqiyik)" },
            { value: "metis", label: "Yes, Métis" },
            { value: "inuit", label: "Yes, Inuit" },
            { value: "no", label: "No" },
            { value: "prefer-not-to-answer", label: "Prefer not to answer" }
          ]
        },
        {
          name: "unbStudent",
          label: "Are you currently a UNB Student?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        {
          name: "nbResidency",
          label: "How long have you lived in New Brunswick?",
          type: "select",
          required: true,
          options: [
            { value: "less-than-1", label: "Less than 1 year" },
            { value: "1-3", label: "1-3 years" },
            { value: "4-6", label: "4-6 years" },
            { value: "7-10", label: "7-10 years" },
            { value: "more-than-10", label: "More than 10 years" },
            { value: "not-in-canada", label: "I do not live in Canada" }
          ]
        },
        {
          name: "maritalStatus",
          label: "Present Marital Status",
          type: "select",
          required: true,
          options: [
            { value: "single", label: "Single" },
            { value: "common-law", label: "Common-Law" },
            { value: "married", label: "Married" },
            { value: "divorced", label: "Divorced" },
            { value: "separated", label: "Separated" },
            { value: "widowed", label: "Widowed" }
          ]
        },
        {
          name: "preferredLanguage",
          label: "What is your preferred language to communicate with the clinic?",
          type: "radio",
          required: true,
          options: [
            { value: "english", label: "English" },
            { value: "french", label: "French" }
          ]
        },
        {
          name: "householdSize",
          label: "How many people live in your home?",
          type: "select",
          required: true,
          options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6 or more" }
          ]
        },
        {
          name: "employed",
          label: "Are you currently employed?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        }
      ]
    },
    {
      id: "financial",
      title: "Financial Information",
      icon: "DollarSign",
      fields: [
        {
          name: "employmentIncome",
          label: "Employment (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "spouseIncome",
          label: "Spouse's Income (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "socialAssistance",
          label: "Social Assistance (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "ei",
          label: "E.I. (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "wcbCppDisability",
          label: "WCB/CPP Disability (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "pensions",
          label: "Pension(s) (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "supportPayments",
          label: "Child or Spousal Support (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "rentalIncome",
          label: "Rental Income (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "childTaxCredit",
          label: "Child Tax Credit (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "otherIncome",
          label: "Other Income (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "totalMonthlyIncome",
          label: "Total Income per month",
          type: "number",
          required: true,
          guidance: "Add the number Zero if you have no income"
        },
        // Deductions section
        {
          name: "childcareExpenses",
          label: "Childcare Expenses (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "medicalExpenses",
          label: "Medical Expenses (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "supportPaymentsDeduction",
          label: "Child or Spousal Support (Total Amount per month)",
          type: "number",
          required: true
        },
        {
          name: "totalDeductions",
          label: "Total Allowable deductions per month",
          type: "number",
          required: true,
          guidance: "Add the number Zero if you have no deductions"
        },
        // Assets section
        {
          name: "cashAndBank",
          label: "Cash / Bank Accounts",
          type: "number",
          required: true
        },
        {
          name: "investments",
          label: "Investments",
          type: "number",
          required: true
        },
        {
          name: "otherAssets",
          label: "Other Liquid Assets or Resources",
          type: "number",
          required: true
        },
        {
          name: "totalAssets",
          label: "Total Assets Available",
          type: "number",
          required: true,
          guidance: "Add the number Zero if you have no Assets"
        }
      ]
    },
    {
      id: "legalIssue",
      title: "Your Legal Issue",
      icon: "Scale",
      fields: [
        {
          name: "legalIssueType",
          label: "Which one of the following categories best applies to your legal issue?",
          type: "select",
          required: true,
          options: [
            { value: "housing", label: "Housing and Tenancy" },
            { value: "benefits", label: "Provincial and Federal benefits" },
            { value: "employment", label: "Employment Law" },
            { value: "human-rights", label: "Human Rights" },
            { value: "small-claims", label: "Small Claims" },
            { value: "notary", label: "Notary / Commissioner of Oaths Services" },
            { value: "divorce", label: "Uncontested Divorce" },
            { value: "provincial-offences", label: "Provincial Offences (Tickets)" },
            { value: "immigration", label: "Immigration" }
          ]
        },
        {
          name: "issueDescription",
          label: "Please provide a detailed description of your legal matter",
          type: "textarea",
          required: true,
          guidance: "Include: 1. Relevant Background Information 2. Parties Involved 3. Current Status 4. Desired Outcome"
        },
        {
          name: "opposingParties",
          label: "Opposing Parties",
          type: "textarea",
          required: true,
          guidance: "Please provide the name(s) of any parties who may have an opposing interest to your own in this matter"
        },
        {
          name: "hasDeadline",
          label: "Do you have a court/hearing date or other deadline approaching?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        {
          name: "deadlineDetails",
          label: "Court/Hearing Date",
          type: "text",
          required: false,
          guidance: "Court Name- YYYY-MM-DD",
          showIf: "hasDeadline === 'yes'"
        },
        {
          name: "documentsSubmitted",
          label: "Required Documents Submission",
          type: "checkbox",
          required: true,
          guidance: "Please confirm you have emailed the required documents to lawclinic@unb.ca"
        }
      ]
    },
    {
      id: "submissionInfo",
      title: "Submission Information",
      icon: "Send",
      fields: [
        {
          name: "submitterName",
          label: "Name of Person who completed this form",
          type: "text",
          required: true
        },
        {
          name: "relationshipToClient",
          label: "Relationship with the potential client",
          type: "text",
          required: true
        },
        {
          name: "submitterEmail",
          label: "Email Address",
          type: "email",
          required: true
        },
        {
          name: "submitterPhone",
          label: "Phone Number",
          type: "tel",
          required: true
        },
        {
          name: "evaluationConsent",
          label: "Service Evaluation Consent",
          type: "checkbox",
          required: true,
          guidance: "I understand that I may be contacted by a Legal Clinic representative to answer questions about the service I receive"
        },
        {
          name: "informationDeclaration",
          label: "Declaration of Truth",
          type: "checkbox",
          required: true,
          guidance: "I hereby declare that the information I have provided is true and correct"
        }
      ]
    }
  ]
};
