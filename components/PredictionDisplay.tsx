
import React from 'react';
import { PredictionResult } from '../types';

interface PredictionDisplayProps {
  result: PredictionResult;
  onFindHospitals: () => void;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result, onFindHospitals }) => {
  const getUrgencyColor = (level: string) => {
    switch(level) {
      case 'emergency': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-slate-800">{result.diseaseName}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getUrgencyColor(result.urgencyLevel)}`}>
                {result.urgencyLevel} Priority
              </span>
            </div>
            <p className="text-slate-500 max-w-2xl">{result.description}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{(result.confidence * 100).toFixed(0)}%</div>
            <div className="text-xs text-blue-400 font-semibold uppercase">Confidence Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Precautions & Guidance
            </h3>
            <ul className="space-y-2">
              {result.precautions.map((p, i) => (
                <li key={i} className="flex items-start text-slate-600 text-sm">
                  <span className="mr-2 text-blue-500">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Common Medications
            </h3>
            <div className="space-y-3">
              {result.medications.map((m, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-semibold text-sm text-slate-800">{m.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{m.description}</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase mt-2">Usage: {m.usage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Specialist</div>
              <div className="text-lg font-bold text-slate-800">{result.specialistType}</div>
            </div>
          </div>
          <button 
            onClick={onFindHospitals}
            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Find {result.specialistType}s Near You
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionDisplay;
