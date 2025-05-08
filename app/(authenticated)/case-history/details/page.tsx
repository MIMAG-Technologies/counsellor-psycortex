"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/sidebar";
import Loader from "@/components/loader";

interface CaseHistoryDetail {
  id: number;
  session_details: {
    session_id: string;
    session_type: string;
    created_at: string;
  };
  user_details: {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    age: number;
    date_of_birth: string;
  };
  counsellor_details: {
    id: string;
    name: string;
  };
  case_history: {
    address: string;
    education: string;
    occupation: string;
    marital_status: string;
    family_type: string;
    family_members: string;
    identification_marks: string[];
    reliability: string;
    previous_consultation: boolean;
    previous_consultation_details: string;
    medical_history: {
      chief_complaints: string;
      present_illness_history: string;
      treatment_history: string;
      past_illness_history: string;
      family_history: string;
    };
    personal_history: {
      childhood_disorders: string;
      home_atmosphere: string;
      scholastic_activities: string;
      sexual_marital_history: string;
      premorbid_personality: string;
    };
    mental_status: {
      general_appearance: string;
      attitude: string;
      motor_behavior: string;
      speech: string;
      cognitive_functions: {
        attention_concentration: string;
        orientation: string;
        memory: string;
        abstract_ability: string;
        general_information: string;
        calculation: string;
        intelligence: string;
      };
      thought_process: {
        stream: string;
        form: string;
        possession: string;
        content: string;
      };
      mood_affect: string;
    };
    follow_up: {
      advice_activities: string;
      follow_up_session: string;
    };
  };
}

export default function CaseHistoryDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [caseDetail, setCaseDetail] = useState<CaseHistoryDetail | null>(null);
  const [activeTab, setActiveTab] = useState("medical");

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(
          `${BASE_URL}/user/get_single_case_history.php?id=${id}`
        );
        const data = await response.json();

        if (data.success) {
          setCaseDetail(data.data);
        }
      } catch (error) {
        console.error("Error fetching case detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCaseDetail();
    }
  }, [id]);

  const DataItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="mb-5">
      <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 mb-1">{label}</p>
      <p className="text-base text-gray-800">{value || "—"}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className=" flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className=" p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-gray-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-1">Case history not found</h2>
            <p className="text-base text-gray-500">The requested case detail could not be located</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className=" py-8">
        {/* Top Bar */}
        <div className="px-4 md:px-10 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <h1 className="text-xl md:text-2xl font-medium text-gray-900">Case History</h1>
            </div>
            <p className="text-sm md:text-base text-gray-500">Session <span className="font-mono">{caseDetail.session_details.session_id}</span></p>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <span className="text-sm md:text-base text-gray-500">{formatDate(caseDetail.session_details.created_at)}</span>
            <span className="px-2 md:px-3 py-1 bg-indigo-500 text-white rounded-full text-xs md:text-sm font-medium">
              {caseDetail.session_details.session_type}
            </span>
          </div>
        </div>

        {/* Patient Card */}
        <div className="px-4 md:px-10">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 py-3 px-6">
              <p className="text-sm font-medium text-indigo-100">PATIENT PROFILE</p>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-14 md:h-16 w-14 md:w-16 bg-indigo-500 text-white rounded-full flex items-center justify-center text-lg md:text-xl font-medium shadow-sm flex-shrink-0">
                    {caseDetail.user_details.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-medium text-gray-800">{caseDetail.user_details.name}</h2>
                    <div className="flex items-center mt-1">
                      <span className="text-sm md:text-base text-gray-500">{caseDetail.user_details.gender}</span>
                      <span className="mx-2 h-1 w-1 rounded-full bg-gray-300"></span>
                      <span className="text-sm md:text-base text-gray-500">{caseDetail.user_details.age} years</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full lg:w-auto">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 flex-shrink-0 bg-indigo-100 rounded-md flex items-center justify-center">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm md:text-base truncate">{caseDetail.user_details.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 flex-shrink-0 bg-indigo-100 rounded-md flex items-center justify-center">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-sm md:text-base">{caseDetail.user_details.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 flex-shrink-0 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-sm md:text-base">{caseDetail.counsellor_details.name}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Occupation</p>
                  <p className="text-sm md:text-base font-medium">{caseDetail.case_history.occupation || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  <p className="text-sm md:text-base font-medium">{caseDetail.case_history.education || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Marital Status</p>
                  <p className="text-sm md:text-base font-medium">{caseDetail.case_history.marital_status || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Family Type</p>
                  <p className="text-sm md:text-base font-medium">{caseDetail.case_history.family_type || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 md:px-10 mb-6 overflow-x-auto">
          <div className="flex space-x-1 border-b border-gray-200 min-w-max">
            <button
              onClick={() => setActiveTab("medical")}
              className={`px-4 py-2 text-sm md:text-base font-medium ${activeTab === "medical" ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Medical History
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 text-sm md:text-base font-medium ${activeTab === "personal" ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Personal History
            </button>
            <button
              onClick={() => setActiveTab("mental")}
              className={`px-4 py-2 text-sm md:text-base font-medium ${activeTab === "mental" ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Mental Status
            </button>
            <button
              onClick={() => setActiveTab("followup")}
              className={`px-4 py-2 text-sm md:text-base font-medium ${activeTab === "followup" ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Follow Up
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 md:px-10 pb-10">
          {/* Medical History Tab */}
          {activeTab === "medical" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-800">Medical History</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                    <h3 className="text-base font-medium text-indigo-700 mb-3">Chief Complaints</h3>
                    <p className="text-base text-gray-700">{caseDetail.case_history.medical_history.chief_complaints || "—"}</p>
                  </div>

                  <div>
                    <DataItem label="Present Illness History" value={caseDetail.case_history.medical_history.present_illness_history} />
                    <DataItem label="Treatment History" value={caseDetail.case_history.medical_history.treatment_history} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <DataItem label="Past Illness History" value={caseDetail.case_history.medical_history.past_illness_history} />
                  <DataItem label="Family History" value={caseDetail.case_history.medical_history.family_history} />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-medium text-gray-700">Previous Consultations</h3>
                    <span className={`px-2 py-1 text-sm font-medium rounded-full ${caseDetail.case_history.previous_consultation ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                      {caseDetail.case_history.previous_consultation ? "Yes" : "No"}
                    </span>
                  </div>

                  {caseDetail.case_history.previous_consultation && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-base text-gray-700">{caseDetail.case_history.previous_consultation_details}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Personal History Tab */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-800">Personal History</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <DataItem label="Childhood Disorders" value={caseDetail.case_history.personal_history.childhood_disorders} />
                    <DataItem label="Home Atmosphere" value={caseDetail.case_history.personal_history.home_atmosphere} />
                    <DataItem label="Scholastic Activities" value={caseDetail.case_history.personal_history.scholastic_activities} />
                  </div>
                  <div>
                    <DataItem label="Sexual/Marital History" value={caseDetail.case_history.personal_history.sexual_marital_history} />
                    <DataItem label="Premorbid Personality" value={caseDetail.case_history.personal_history.premorbid_personality} />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 rounded-lg p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-base font-medium text-gray-700 mb-3">Address</h3>
                      <p className="text-base text-gray-700">{caseDetail.case_history.address || "—"}</p>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-700 mb-3">Family Members</h3>
                      <p className="text-base text-gray-700">{caseDetail.case_history.family_members || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-base font-medium text-gray-700 mb-3">Identification Marks</h3>
                  <div className="flex flex-wrap gap-2">
                    {caseDetail.case_history.identification_marks.length > 0 ?
                      caseDetail.case_history.identification_marks.map((mark, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {mark}
                        </span>
                      )) :
                      <span className="text-base text-gray-500">None specified</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mental Status Tab */}
          {activeTab === "mental" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-800">Mental Status Examination</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-lg border border-indigo-100">
                    <p className="text-sm font-medium uppercase tracking-wider text-indigo-600 mb-2">General Appearance</p>
                    <p className="text-base">{caseDetail.case_history.mental_status.general_appearance || "—"}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100">
                    <p className="text-sm font-medium uppercase tracking-wider text-purple-600 mb-2">Mood & Affect</p>
                    <p className="text-base">{caseDetail.case_history.mental_status.mood_affect || "—"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <DataItem label="Attitude" value={caseDetail.case_history.mental_status.attitude} />
                  <DataItem label="Motor Behavior" value={caseDetail.case_history.mental_status.motor_behavior} />
                  <DataItem label="Speech" value={caseDetail.case_history.mental_status.speech} />
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
                    <h3 className="text-base font-medium text-gray-800">Cognitive Functions</h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(caseDetail.case_history.mental_status.cognitive_functions).map(([key, value]) => (
                        <div key={key} className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                          <p className="text-sm font-medium text-indigo-600 mb-1">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </p>
                          <p className="text-base">{value || "—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                    <h3 className="text-base font-medium text-gray-800">Thought Process</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(caseDetail.case_history.mental_status.thought_process).map(([key, value]) => (
                      <div key={key} className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <p className="text-sm font-medium text-purple-600 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                        <p className="text-base">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Follow Up Tab */}
          {activeTab === "followup" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="h-8 w-8 bg-indigo-100 rounded-md flex items-center justify-center">
                    <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-800">Follow Up</h2>
                </div>

                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <svg className="h-5 w-5 mr-2 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="font-medium">Advice & Activities</h3>
                  </div>
                  <p className="text-indigo-100 whitespace-pre-line text-base">{caseDetail.case_history.follow_up.advice_activities || "No advice provided"}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <svg className="h-5 w-5 mr-2 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="font-medium">Next Session</h3>
                  </div>
                  <p className="text-purple-100 whitespace-pre-line text-base">{caseDetail.case_history.follow_up.follow_up_session || "No next session scheduled"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}