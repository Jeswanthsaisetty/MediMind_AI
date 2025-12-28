
export interface SymptomData {
  symptoms: string;
  duration: number;
  severity: 'low' | 'medium' | 'high';
}

export interface PredictionResult {
  diseaseName: string;
  confidence: number;
  description: string;
  precautions: string[];
  medications: {
    name: string;
    description: string;
    usage: string;
  }[];
  specialistType: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

export interface HospitalRecommendation {
  name: string;
  city: string;
  doctorName: string;
  specialization: string;
  appointmentLink: string;
  rating: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}
