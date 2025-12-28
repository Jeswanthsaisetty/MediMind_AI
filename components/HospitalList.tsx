
import React from 'react';
import { HospitalRecommendation } from '../types.ts';

interface HospitalListProps {
  hospitals: HospitalRecommendation[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Search Failed</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          Try Searching Again
        </button>
      </div>
    );
  }

  if (hospitals.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Specialists Found</h3>
        <p className="text-slate-500 mb-6">We couldn't find specific recommendations for this condition in our database. Please consult a local healthcare provider.</p>
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Search Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hospitals.map((h, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Verified Facility</span>
            {h.rating && <span className="text-sm font-bold text-amber-500">★ {h.rating}</span>}
          </div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{h.name}</h3>
          <p className="text-slate-500 text-sm mb-4">{h.city}, India</p>
          
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-6 p-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">{h.doctorName}</div>
                <div className="text-[10px] text-slate-500">{h.specialization}</div>
              </div>
            </div>
          </div>

          <a 
            href={h.appointmentLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center py-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-sm font-bold rounded-xl transition-all"
          >
            Book Appointment
          </a>
        </div>
      ))}
    </div>
  );
};

export default HospitalList;
