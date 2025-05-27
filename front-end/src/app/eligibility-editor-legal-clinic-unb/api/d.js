
const db = new sqlite3.Database('form.db');
 
// Example JSON object
const form = {
  "CONSTANTS": {
    "INCOME": {
      "MIN_ANNUAL": 0,
      "MAX_ANNUAL": 42000,
      "PER_DEPENDENT": 5000
    },
    "AGE": {
      "MIN": 18,
      "MAX": 120
    },
    "HOUSEHOLD": {
      "MAX_DEPENDENTS": 10,
      "MIN_SIZE": 1,
      "MAX_SIZE": 6
    }
  },
  "MONTHLY_THRESHOLDS": {
    "1": {
      "income": 1900,
      "assets": 5000
    },
    "2": {
      "income": 2800,
      "assets": 9000
    },
    "3": {
      "income": 2900,
      "assets": 10000
    },
    "4": {
      "income": 3100,
      "assets": 11000
    },
    "5": {
      "income": 3300,
      "assets": 12000
    },
    "6": {
      "income": 3500,
      "assets": 13000
    }
  },
  "RESOURCES": {
      "Emergency Services" : {
        "phoneNumber": "911",
        "category": "emergency",
        "description": "For immediate danger"
      },
      "Mental Health Crisis Line" : {
        "phoneNumber": "1-800-667-5005",
        "category": "emergency",
        "description": "24/7 crisis support"
      }
  },
  "formConfig": {
    "metadata": {
      "version": "2.2.25",
      "lastUpdated": "2025-05-26T18:58:33.426Z",
      "clinic": {
        "name": "Eligibility Screening Form",
        "phone": "(506) 452-6313",
        "email": "lawclinic@unb.ca",
        "address": "41 Dineen Drive, Fredericton, NB"
      }
    },
    "steps": [
      {
        "id": "emergency",
        "title": "Emergency Assessment",
        "critical": true,
        "icon": "AlertCircle",
        "guidance": "Your safety is our primary concern. Please let us know if you need immediate assistance.",
        "fields": [
          {
            "name": "immediateRisk",
            "label": "Are you in immediate danger?",
            "type": "radio",
            "required": true,
            "critical": true,
            "validation": {
              "rules": [
                "immediateRisk"
              ]
            },
            "options": [
              {
                "value": "yes",
                "label": "Yes, I need immediate help"
              },
              {
                "value": "no",
                "label": "No, I am safe"
              }
            ]
          },
          {
            "name": "shelterNeeded",
            "label": "Do you need emergency shelter?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "shelterNeeded"
              ]
            },
            "options": [
              {
                "value": "yes",
                "label": "Yes"
              },
              {
                "value": "no",
                "label": "No"
              }
            ]
          }
        ]
      },
      {
        "id": "disclaimers",
        "title": "Disclaimers and Consent",
        "icon": "FileText",
        "critical": true,
        "fields": [
          {
            "name": "intakeDisclaimer",
            "label": "Intake Disclaimer",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "intakeDisclaimer"
              ]
            },
            "options": [
              {
                "value": "agree",
                "label": "I agree"
              },
              {
                "value": "disagree",
                "label": "I do not agree"
              }
            ]
          },
          {
            "name": "emailCommunicationConsent",
            "label": "Email Communication Authorization",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "emailCommunicationConsent"
              ]
            },
            "options": [
              {
                "value": "accept",
                "label": "I accept"
              },
              {
                "value": "decline",
                "label": "I decline"
              }
            ]
          }
        ]
      },
      {
        "id": "demographic",
        "title": "Demographic Information",
        "icon": "User",
        "fields": [
          {
            "name": "firstName",
            "label": "First Name",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            }
          },
          {
            "name": "middleName",
            "label": "Middle Name",
            "type": "text",
            "required": false
          },
          {
            "name": "lastName",
            "label": "Last Name",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            }
          },
          {
            "name": "address",
            "label": "Address",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            }
          },
          {
            "name": "cityProvince",
            "label": "City/Province",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            }
          },
          {
            "name": "postalCode",
            "label": "Postal Code",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "postalCode"
              ]
            }
          },
          {
            "name": "phoneNumber",
            "label": "Phone Number",
            "type": "tel",
            "required": true,
            "validation": {
              "rules": [
                "phoneNumber"
              ]
            }
          },
          {
            "name": "phoneType",
            "label": "This phone number is my",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "home",
                "label": "Home phone number"
              },
              {
                "value": "work",
                "label": "Work phone number"
              },
              {
                "value": "cell",
                "label": "Cell phone number"
              }
            ]
          },
          {
            "name": "phoneMessagePermission",
            "label": "If we call and someone else answers, can we tell the person who answers that we are calling from the UNB Legal Clinic?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "yes",
                "label": "Yes"
              },
              {
                "value": "no",
                "label": "No"
              }
            ]
          },
          {
            "name": "dateOfBirth",
            "label": "Date of Birth",
            "type": "date",
            "required": true,
            "validation": {
              "rules": [
                "dateOfBirth"
              ]
            },
            "guidance": "Must be between 18 and 85 years old"
          },
          {
            "name": "gender",
            "label": "Gender",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "female",
                "label": "Female"
              },
              {
                "value": "male",
                "label": "Male"
              },
              {
                "value": "nonbinary",
                "label": "Non-binary"
              },
              {
                "value": "prefer-not-to-say",
                "label": "Prefer not to say"
              },
              {
                "value": "other",
                "label": "Other"
              }
            ]
          },
          {
            "name": "indigenous",
            "label": "Do you identify as an Indigenous person?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "first-nations",
                "label": "Yes, First Nations (e.g., Mi'kmaq or Wolastoqiyik)"
              },
              {
                "value": "metis",
                "label": "Yes, Métis"
              },
              {
                "value": "inuit",
                "label": "Yes, Inuit"
              },
              {
                "value": "no",
                "label": "No"
              },
              {
                "value": "prefer-not-to-answer",
                "label": "Prefer not to answer"
              }
            ]
          },
          {
            "name": "unbStudent",
            "label": "Are you currently a UNB Student?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "yes",
                "label": "Yes"
              },
              {
                "value": "no",
                "label": "No"
              }
            ]
          },
          {
            "name": "nbResidency",
            "label": "How long have you lived in New Brunswick?",
            "type": "select",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "less-than-1",
                "label": "Less than 1 year"
              },
              {
                "value": "1-3",
                "label": "1-3 years"
              },
              {
                "value": "4-6",
                "label": "4-6 years"
              },
              {
                "value": "7-10",
                "label": "7-10 years"
              },
              {
                "value": "more-than-10",
                "label": "More than 10 years"
              },
              {
                "value": "not-in-canada",
                "label": "I do not live in Canada"
              }
            ]
          },
          {
            "name": "maritalStatus",
            "label": "Present Marital Status",
            "type": "select",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "single",
                "label": "Single"
              },
              {
                "value": "common-law",
                "label": "Common-Law"
              },
              {
                "value": "married",
                "label": "Married"
              },
              {
                "value": "divorced",
                "label": "Divorced"
              },
              {
                "value": "separated",
                "label": "Separated"
              },
              {
                "value": "widowed",
                "label": "Widowed"
              }
            ]
          },
          {
            "name": "preferredLanguage",
            "label": "What is your preferred language to communicate with the clinic?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "english",
                "label": "English"
              },
              {
                "value": "french",
                "label": "French"
              }
            ]
          },
          {
            "name": "householdSize",
            "label": "How many people live in your home?",
            "type": "select",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "1",
                "label": "1"
              },
              {
                "value": "2",
                "label": "2"
              },
              {
                "value": "3",
                "label": "3"
              },
              {
                "value": "4",
                "label": "4"
              },
              {
                "value": "5",
                "label": "5"
              },
              {
                "value": "6",
                "label": "6 or more"
              }
            ]
          },
          {
            "name": "employed",
            "label": "Are you currently employed?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "yes",
                "label": "Yes"
              },
              {
                "value": "no",
                "label": "No"
              }
            ]
          }
        ]
      },
      {
        "id": "financial",
        "title": "Financial Information",
        "icon": "DollarSign",
        "fields": [
          {
            "name": "employmentIncome",
            "label": "Employment (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "spouseIncome",
            "label": "Spouse's Income (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "socialAssistance",
            "label": "Social Assistance (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "ei",
            "label": "E.I. (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "wcbCppDisability",
            "label": "WCB/CPP Disability (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "pensions",
            "label": "Pension(s) (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "supportPayments",
            "label": "Child or Spousal Support (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "rentalIncome",
            "label": "Rental Income (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "childTaxCredit",
            "label": "Child Tax Credit (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "otherIncome",
            "label": "Other Income (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "totalMonthlyIncome",
            "label": "Total Income per month",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric",
                "totalMonthlyIncome"
              ]
            },
            "guidance": "Add the number Zero if you have no income"
          },
          {
            "name": "childcareExpenses",
            "label": "Childcare Expenses (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "medicalExpenses",
            "label": "Medical Expenses (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "supportPaymentsDeduction",
            "label": "Child or Spousal Support (Total Amount per month)",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "totalDeductions",
            "label": "Total Allowable deductions per month",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            },
            "guidance": "Add the number Zero if you have no deductions"
          },
          {
            "name": "cashAndBank",
            "label": "Cash / Bank Accounts",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "investments",
            "label": "Investments",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "otherAssets",
            "label": "Other Liquid Assets or Resources",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric"
              ]
            }
          },
          {
            "name": "totalAssets",
            "label": "Total Assets Available",
            "type": "number",
            "required": true,
            "validation": {
              "rules": [
                "numeric",
                "totalAssets"
              ]
            },
            "guidance": "Add the number Zero if you have no Assets"
          }
        ]
      },
      {
        "id": "legalIssue",
        "title": "Your Legal Issue",
        "icon": "Scale",
        "fields": [
          {
            "name": "legalIssueType",
            "label": "Which one of the following categories best applies to your legal issue?",
            "type": "select",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "housing",
                "label": "Housing and Tenancy"
              },
              {
                "value": "benefits",
                "label": "Provincial and Federal benefits"
              },
              {
                "value": "employment",
                "label": "Employment Law"
              },
              {
                "value": "human-rights",
                "label": "Human Rights"
              },
              {
                "value": "small-claims",
                "label": "Small Claims"
              },
              {
                "value": "notary",
                "label": "Notary / Commissioner of Oaths Services"
              },
              {
                "value": "divorce",
                "label": "Uncontested Divorce"
              },
              {
                "value": "provincial-offences",
                "label": "Provincial Offences (Tickets)"
              },
              {
                "value": "immigration",
                "label": "Immigration"
              }
            ]
          },
          {
            "name": "issueDescription",
            "label": "Please provide a detailed description of your legal matter",
            "type": "textarea",
            "required": true,
            "validation": {
              "rules": [
                "issueDescription"
              ]
            },
            "guidance": "Include: 1. Relevant Background Information 2. Parties Involved 3. Current Status 4. Desired Outcome"
          },
          {
            "name": "opposingParties",
            "label": "Opposing Parties",
            "type": "textarea",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "guidance": "Please provide the name(s) of any parties who may have an opposing interest to your own in this matter"
          },
          {
            "name": "hasDeadline",
            "label": "Do you have a court/hearing date or other deadline approaching?",
            "type": "radio",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            },
            "options": [
              {
                "value": "yes",
                "label": "Yes"
              },
              {
                "value": "no",
                "label": "No"
              }
            ]
          },
          {
            "name": "deadlineDetails",
            "label": "Court/Hearing Date",
            "type": "text",
            "required": false,
            "guidance": "Court Name- YYYY-MM-DD",
            "showIf": "hasDeadline === 'yes'"
          },
          {
            "name": "documentsSubmitted",
            "label": "Required Documents Submission",
            "type": "checkbox",
            "required": true,
            "validation": {
              "rules": [
                "documentsSubmitted"
              ]
            },
            "guidance": "Please confirm you have emailed the required documents to lawclinic@unb.ca"
          }
        ]
      },
      {
        "id": "submissionInfo",
        "title": "Submission Information",
        "icon": "Send",
        "fields": [
          {
            "name": "submitterName",
            "label": "Name of Person who completed this form",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            }
          },
          {
            "name": "relationshipToClient",
            "label": "Relationship with the potential client",
            "type": "text",
            "required": true,
            "validation": {
              "rules": [
                "required"
              ]
            }
          },
          {
            "name": "submitterEmail",
            "label": "Email Address",
            "type": "email",
            "required": true,
            "validation": {
              "rules": [
                "email"
              ]
            }
          },
          {
            "name": "submitterPhone",
            "label": "Phone Number",
            "type": "tel",
            "required": true,
            "validation": {
              "rules": [
                "phoneNumber"
              ]
            }
          },
          {
            "name": "evaluationConsent",
            "label": "Service Evaluation Consent",
            "type": "checkbox",
            "required": true,
            "validation": {
              "rules": [
                "evaluationConsent"
              ]
            },
            "guidance": "I understand that I may be contacted by a Legal Clinic representative to answer questions about the service I receive"
          },
          {
            "name": "informationDeclaration",
            "label": "Declaration of Truth",
            "type": "checkbox",
            "required": true,
            "validation": {
              "rules": [
                "informationDeclaration"
              ]
            },
            "guidance": "I hereby declare that the information I have provided is true and correct"
          }
        ]
      }
    ]
  }
}

db.serialize(() => {
  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS constants (
   category TEXT,
    key TEXT,
    value INTEGER
  )`);

  // Insert constants
  for (const [category, values] of Object.entries(data.CONSTANTS)) {
    for (const [key, value] of Object.entries(values)) {
      db.run(`INSERT INTO constants (category, key, value) VALUES (?, ?, ?)`,
        [category, key, value]);
    }
  }

  db.run(`CREATE TABLE IF NOT EXISTS monthly_thresholds (
    household_size INTEGER PRIMARY KEY,
    income INTEGER,
    assets INTEGER
  )`);

  // Insert monthly thresholds
  for (const [size, values] of Object.entries(data.MONTHLY_THRESHOLDS)) {
    db.run(`INSERT INTO monthly_thresholds (household_size, income, assets) VALUES (?, ?, ?)`,
      [parseInt(size), values.income, values.assets]);
  }

  db.run(`CREATE TABLE IF NOT EXISTS resources (
    name TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT
  )`);

  // Insert monthly thresholds
  for (const [size, values] of Object.entries(data.RESOURCES)) {
    db.run(`INSERT INTO resources (household_size, income, assets) VALUES (?, ?, ?)`,
      [parseInt(size), values.income, values.assets]);
  }
});

 
  // db.run(`CREATE TABLE IF NOT EXISTS fields (
	// id INTEGER PRIMARY KEY AUTOINCREMENT,
	// form_id TEXT,
	// name TEXT,
	// label TEXT,
	// type TEXT,
	// required BOOLEAN,
	// FOREIGN KEY(form_id) REFERENCES forms(id)
  // )`);
 
  // db.run(`CREATE TABLE IF NOT EXISTS validation_rules (
	// id INTEGER PRIMARY KEY AUTOINCREMENT,
	// field_id INTEGER,
	// rule TEXT,
	// FOREIGN KEY(field_id) REFERENCES fields(id)
  // )`);
 
  // db.run(`CREATE TABLE IF NOT EXISTS options (
	// id INTEGER PRIMARY KEY AUTOINCREMENT,
	// field_id INTEGER,
	// value TEXT,
	// label TEXT,
	// FOREIGN KEY(field_id) REFERENCES fields(id)
  // )`);
 
  // // Insert form
  // db.run(`INSERT INTO forms (id, title, icon, critical) VALUES (?, ?, ?, ?)`,
	// [form.id, form.title, form.icon, form.critical]);
 
  // // Insert fields and related data
  // form.fields.forEach(field => {
	// db.run(`INSERT INTO fields (form_id, name, label, type, required) VALUES (?, ?, ?, ?, ?)`,
  // 	[form.id, field.name, field.label, field.type, field.required],
  // 	function (err) {
  //   	if (err) throw err;
  //   	const fieldId = this.lastID;
 
  //   	// Insert validation rules
  //   	field.validation?.rules?.forEach(rule => {
  //     	db.run(`INSERT INTO validation_rules (field_id, rule) VALUES (?, ?)`,
  //       	[fieldId, rule]);
  //   	});
 
  //   	// Insert options
  //   	field.options?.forEach(opt => {
  //     	db.run(`INSERT INTO options (field_id, value, label) VALUES (?, ?, ?)`,
  //       	[fieldId, opt.value, opt.label]);
  //   	});
  // 	}
	// );
  // });
 
db.close(() => {
  console.log("Nested JSON successfully imported into SQLite database.");
});
