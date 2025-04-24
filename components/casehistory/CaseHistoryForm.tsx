import { useState } from 'react';
import { CaseHistoryFormData } from '@/types/casehistory/casehistoryform';
import { submitCaseHistory } from '@/utils/ChatSession/CaseHistorySubmit';
import { toast } from 'react-toastify';

interface CaseHistoryFormProps {
  userId: string;
  sessionId: string;
  sessionType: "video" | "chat";
  counsellorId: string;
  onClose: () => void;
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox"; 
  options?: string[];
}

export function CaseHistoryForm({
  userId,
  sessionId,
  sessionType,
  counsellorId,
  onClose
}: CaseHistoryFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const initialFormData: CaseHistoryFormData = {
    user_id: userId,
    session_id: sessionId,
    session_type: sessionType,
    counsellor_id: counsellorId,
    address: '',
    education: '',
    occupation: '',
    marital_status: 'single',
    family_type: 'nuclear',
    family_members: '',
    identification_mark_1: '',
    identification_mark_2: '',
    reliability: 'good',
    previous_consultation: false,
    previous_consultation_details: '',
    chief_complaints: '',
    present_illness_history: '',
    treatment_history: '',
    past_illness_history: '',
    family_history: '',
    childhood_disorders: '',
    home_atmosphere: '',
    scholastic_activities: '',
    sexual_marital_history: '',
    premorbid_personality: '',
    general_appearance: '',
    attitude: '',
    motor_behavior: '',
    speech: '',
    attention_concentration: '',
    orientation: '',
    memory: '',
    abstract_ability: '',
    general_information: '',
    calculation: '',
    intelligence: '',
    mood_affect: '',
    thought_stream: '',
    thought_form: '',
    thought_possession: '',
    thought_content: '',
    advice_activities: '',
    follow_up_session: ''
  };

  const [formData, setFormData] = useState<CaseHistoryFormData>(initialFormData);

  const formSections: { title: string; fields: FormField[] }[] = [
    {
      title: "Personal Information",
      fields: [
        { name: "address", label: "Address", type: "textarea" },
        { name: "education", label: "Education", type: "text" },
        { name: "occupation", label: "Occupation", type: "text" },
        { name: "marital_status", label: "Marital Status", type: "select", 
          options: ["single", "married", "divorced", "widowed"] },
        { name: "family_type", label: "Family Type", type: "select",
          options: ["nuclear", "joint", "extended"] },
        { name: "family_members", label: "Family Members", type: "text" }
      ]
    },
    {
      title: "Identification & Medical History",
      fields: [
        { name: "identification_mark_1", label: "Identification Mark 1", type: "text" },
        { name: "identification_mark_2", label: "Identification Mark 2", type: "text" },
        { name: "reliability", label: "Reliability", type: "select", 
          options: ["poor", "fair", "good", "excellent"] },
        { name: "previous_consultation", label: "Previous Consultation", type: "checkbox" },
        { name: "previous_consultation_details", label: "Previous Consultation Details", type: "textarea" },
        { name: "chief_complaints", label: "Chief Complaints", type: "textarea" },
        { name: "present_illness_history", label: "Present Illness History", type: "textarea" }
      ]
    },
    {
      title: "Treatment & Family History",
      fields: [
        { name: "treatment_history", label: "Treatment History", type: "textarea" },
        { name: "past_illness_history", label: "Past Illness History", type: "textarea" },
        { name: "family_history", label: "Family History", type: "textarea" },
        { name: "childhood_disorders", label: "Childhood Disorders", type: "textarea" },
        { name: "home_atmosphere", label: "Home Atmosphere", type: "textarea" }
      ]
    },
    {
      title: "Personal Assessment",
      fields: [
        { name: "scholastic_activities", label: "Scholastic Activities", type: "textarea" },
        { name: "sexual_marital_history", label: "Sexual/Marital History", type: "textarea" },
        { name: "premorbid_personality", label: "Premorbid Personality", type: "textarea" },
        { name: "general_appearance", label: "General Appearance", type: "textarea" },
        { name: "attitude", label: "Attitude", type: "textarea" }
      ]
    },
    {
      title: "Mental Status",
      fields: [
        { name: "motor_behavior", label: "Motor Behavior", type: "textarea" },
        { name: "speech", label: "Speech", type: "textarea" },
        { name: "attention_concentration", label: "Attention & Concentration", type: "textarea" },
        { name: "orientation", label: "Orientation", type: "textarea" },
        { name: "memory", label: "Memory", type: "textarea" }
      ]
    },
    {
      title: "Cognitive Assessment",
      fields: [
        { name: "abstract_ability", label: "Abstract Ability", type: "textarea" },
        { name: "general_information", label: "General Information", type: "textarea" },
        { name: "calculation", label: "Calculation Ability", type: "textarea" },
        { name: "intelligence", label: "Intelligence Assessment", type: "textarea" }
      ]
    },
    {
      title: "Thought Process",
      fields: [
        { name: "mood_affect", label: "Mood & Affect", type: "textarea" },
        { name: "thought_stream", label: "Thought Stream", type: "textarea" },
        { name: "thought_form", label: "Thought Form", type: "textarea" },
        { name: "thought_possession", label: "Thought Possession", type: "textarea" },
        { name: "thought_content", label: "Thought Content", type: "textarea" }
      ]
    },
    {
      title: "Recommendations",
      fields: [
        { name: "advice_activities", label: "Advice & Activities", type: "textarea" },
        { name: "follow_up_session", label: "Follow-up Session Details", type: "textarea" }
      ]
    }
  ];

  const getFieldValue = (field: FormField, data: CaseHistoryFormData): string => {
    // Ensure field.type matches the FormField interface
    const value = data[field.name as keyof CaseHistoryFormData];
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    return value?.toString() || '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await submitCaseHistory(formData);
      if (response.success) {
        toast.success('Case history submitted successfully');
        onClose();
      } else {
        toast.error(response.message || 'Failed to submit case history');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit case history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Form Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Submit Case History</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {formSections.length}
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <h3 className="text-lg font-medium mb-4">{formSections[currentStep].title}</h3>
          {formSections[currentStep].fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={getFieldValue(field, formData)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {field.options?.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={getFieldValue(field, formData)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                  }))}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={!!formData[field.name as keyof typeof formData]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.checked
                  }))}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              ) : (
                <input
                  type={field.type}
                  value={getFieldValue(field, formData)}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    [field.name]: e.target.value
                  }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {currentStep < formSections.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}