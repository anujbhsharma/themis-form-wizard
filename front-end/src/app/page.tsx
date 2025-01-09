"use client"

import { useState } from 'react';
import FormWizard from './components/FormWizard';
import IntakeForm from './components/IntakeForm';

import HomeHeader from './components/Home';
import AdditionalResources from './components/AdditionalResources';

import resourceData from "./lib/additional.json";
import formSchema from "./lib/intake.json";

const tabItems = [
  {
    id: 0,
    label: "Intake Form",
    component: (props) => <IntakeForm formSchema={formSchema} />
  },
  {
    id: 1,
    label: "Eligibility Check",
    component: () => <FormWizard />
  },
  {
    id: 2,
    label: "Resources",
    component: () => <AdditionalResources resources={resourceData} />
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen bg-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <HomeHeader />
        
        <div className="mt-8 mb-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-red-100">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-xl bg-red-50 p-1.5 gap-1">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-6 py-3
                      rounded-lg
                      font-medium
                      transition-all duration-300 ease-in-out
                      ${activeTab === tab.id 
                        ? 'bg-white text-red-700 shadow-md transform scale-105' 
                        : 'text-red-600 hover:bg-white/50'
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="transition-all duration-300 ease-in-out min-h-[500px]">
              {tabItems[activeTab].component()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            © 2024 UNB Legal Clinic · Powered by Themiscore
          </p>
        </div>
      </div>
    </main>
  );
}