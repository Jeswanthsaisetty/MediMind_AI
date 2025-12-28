
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import SymptomForm from './components/SymptomForm.tsx';
import PredictionDisplay from './components/PredictionDisplay.tsx';
import HospitalList from './components/HospitalList.tsx';
import ChatBot from './components/ChatBot.tsx';
import { SymptomData, PredictionResult, HospitalRecommendation } from './types.ts';
import { predictDisease, findHospitals } from './services/geminiService.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predict' | 'chat' | 'hospitals'>('predict');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [hospitals, setHospitals] = useState<HospitalRecommendation[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isSearchingHospitals, setIsSearchingHospitals] = useState(false);
  const [hospitalError, setHospitalError] = useState<string | null>(null);

  const handleSymptomSubmit = async (data: SymptomData) => {
    setIsPredicting(true);
    setPrediction(null);
    setHospitals([]);
    setHospitalError(null);
    try {
      const result = await predictDisease(data);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to analyze symptoms. Please check your network and API key.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleFindHospitals = async () => {
    if (!prediction) return;
    setActiveTab('hospitals');
    setIsSearchingHospitals(true);
    setHospitalError(null);
    try {
      const results = await findHospitals(prediction.specialistType, prediction.diseaseName);
      setHospitals(results);
      if (results.length === 0) {
        setHospitalError("No specialized hospitals were found for this condition in your region.");
      }
    } catch (error) {
      console.error("Hospital search error:", error);
      setHospitalError("The medical search service is currently unavailable. This might be due to API limitations or search grounding issues.");
    } finally {
      setIsSearchingHospitals(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {activeTab === 'predict' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">
                  Intelligent Disease <br />
                  <span className="text-blue-600">Prediction System.</span>
                </h1>
                <p className="mt-4 text-slate-500 text-lg max-w-md">
                  Leveraging cutting-edge AI to provide early health warnings and bridge the gap to medical professional care.
                </p>
              </div>
              <SymptomForm onSubmit={handleSymptomSubmit} isLoading={isPredicting} />
            </div>

            <div className="min-h-[400px]">
              {prediction ? (
                <PredictionDisplay result={prediction} onFindHospitals={handleFindHospitals} />
              ) : (
                <div className="bg-slate-100 rounded-2xl h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Awaiting Your Input</h3>
                  <p className="text-slate-400 mt-2 max-w-xs">Fill out the form to see detailed AI-powered health analysis and predictions.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'hospitals' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Recommended Specialists</h2>
                <p className="text-slate-500 mt-2">Top medical centers and doctors in India specialized in treating {prediction?.diseaseName || 'your condition'}.</p>
              </div>
              {hospitals.length > 0 && (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-blue-200">
                  Found {hospitals.length} Recommendations
                </div>
              )}
            </div>
            
            {(hospitals.length > 0 || isSearchingHospitals || hospitalError) ? (
              <HospitalList 
                hospitals={hospitals} 
                isLoading={isSearchingHospitals} 
                error={hospitalError}
                onRetry={handleFindHospitals}
              />
            ) : (
              <div className="text-center p-20 bg-white rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Start an Analysis First</h3>
                <p className="text-slate-500 mb-6">Please analyze your symptoms in the first tab to get relevant specialist recommendations for your specific health needs.</p>
                <button 
                  onClick={() => setActiveTab('predict')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                  Analyze Symptoms Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">MediMind AI Concierge</h2>
              <p className="text-slate-500 mt-2">Your interactive medical expert available for any health-related queries.</p>
            </div>
            <ChatBot />
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">MediMind AI</span>
          </div>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Disclaimer: This system is for educational and informational purposes only. Always consult a qualified medical professional for diagnosis and treatment.
          </p>
          <div className="mt-8 text-xs text-slate-300">
            &copy; 2024 Team MediMind AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
