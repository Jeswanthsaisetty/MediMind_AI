
import React, { useState } from 'react';
import { SymptomData } from '../types';

interface SymptomFormProps {
  onSubmit: (data: SymptomData) => void;
  isLoading: boolean;
}

const SymptomForm: React.FC<SymptomFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SymptomData>({
    symptoms: '',
    duration: 1,
    severity: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Check Symptoms</h2>
      <p className="text-slate-500 mb-8">Enter your symptoms accurately for a preliminary AI-driven health assessment.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            What are you feeling?
          </label>
          <textarea
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[120px]"
            placeholder="e.g. Constant headache, high fever, fatigue, sore throat..."
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Severity Level
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
            >
              <option value="low">Low - Mild discomfort</option>
              <option value="medium">Medium - Noticeable pain/issues</option>
              <option value="high">High - Severe impact on daily life</option>
            </select>
          </div>
        </div>

        {formData.symptoms.toLowerCase().includes('fever') && formData.duration >= 2 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-amber-800">Alert: Fever for 2+ days requires urgent clinical evaluation.</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.01]'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Health Data...
            </span>
          ) : 'Analyze Symptoms'}
        </button>
      </form>
    </div>
  );
};

export default SymptomForm;
