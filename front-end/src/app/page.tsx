"use client"

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
    icon: "📝",
    description: "Submit your initial consultation request",
    component: () => <IntakeForm formSchema={formSchema} />
  },
  {
    id: 1,
    label: "Eligibility Check",
    icon: "✓",
    description: "Check if you qualify for our services",
    component: () => <FormWizard />
  },
  {
    id: 2,
    label: "Resources",
    icon: "📚",
    description: "Access helpful legal resources",
    component: () => <AdditionalResources resources={resourceData} />
  }
];

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[500px]">
    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
  </div>
);

const TabButton = ({ tab, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: isActive ? 1 : 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex items-center gap-2
      px-6 py-3
      rounded-lg
      font-medium
      transition-all duration-300
      ${isActive 
        ? 'bg-white text-red-700 shadow-lg' 
        : 'text-red-600 hover:bg-white/50'
      }
    `}
  >
    <span className="text-lg">{tab.icon}</span>
    <span>{tab.label}</span>
  </motion.button>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 py-1  max-w-7xl">
        <HomeHeader />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 mb-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-100"
        >
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="flex flex-col items-center mb-2">
              <div className="inline-flex rounded-xl bg-red-50 p-1.5 gap-1 mb-4">
                {tabItems.map((tab) => (
                  <TabButton
                    key={tab.id}
                    tab={tab}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">
                {tabItems[activeTab].description}
              </p>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[500px]"
              >
                <Suspense fallback={<LoadingFallback />}>
                  {tabItems[activeTab].component()}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center mt-2 text-gray-600">
          <p className="text-sm">
            © {new Date().getFullYear()} UNB Legal Clinic · 
            <a 
              href="https://themiscore.com" 
              className="ml-1 text-red-600 hover:text-red-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Themiscore
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}