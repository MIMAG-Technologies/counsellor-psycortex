import { useState } from 'react';
import { CaseHistoryFormData } from '@/types/casehistory/casehistoryform';
import { submitCaseHistory } from '@/utils/ChatSession/CaseHistorySubmit';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CaseHistoryFormData>(initialFormData);


  const formSections: { title: string; fields: FormField[] }[] = [
    {
      title: "Personal Information",
      fields: [
        { name: "address", label: "Address", type: "textarea" },
        { name: "education", label: "Education", type: "text" },
        { name: "occupation", label: "Occupation", type: "text" },
        { name: "marital_status", label: "Marital Status", type: "text" },
        { name: "family_type", label: "Family Type", type: "select",
          options: ["nuclear", "extended", "sub-urban", "living_alone", "other"] },
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
      if (response) {
        toast.success('Case history submitted successfully');
        onClose();
      } else {
        toast.error('Failed to submit case history');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit case history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[12px] bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl min-h-[80vh] max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header with Progress */}
        <div className="bg-indigo-500 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              Submit Case History
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-indigo-100 text-sm">
              {formSections[currentStep].title}
            </p>
            <div className="text-indigo-100 text-sm">
              Step {currentStep + 1} of {formSections.length}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-indigo-400/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{
                width: `${((currentStep + 1) / formSections.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-12rem)]">
          <div className="space-y-6">
            {formSections[currentStep].fields.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-[200px,1fr] gap-6 items-start"
              >
                <label className="text-sm font-medium text-gray-700 pt-2">
                  {field.label}
                </label>
                <div>
                  {field.type === "select" ? (
                    <select
                      value={getFieldValue(field, formData)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={getFieldValue(field, formData)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          !!FormData[field.name as keyof typeof FormData]
                        }
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [field.name]: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Yes</span>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={getFieldValue(field, formData)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 border-t border-gray-100 bg-white/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
          <div className="flex-1">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Previous
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < formSections.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-1"
              >
                Next
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Case History</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}