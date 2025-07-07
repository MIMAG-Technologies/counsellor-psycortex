"use client";

import { Language } from "@/app/apply/utils/counsellorTypes";
import { getFilters } from "@/app/apply/utils/counsellorUtils";
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoTrash } from "react-icons/io5";
import { toast } from "react-toastify";
import { counsellor } from "../utils/counsellorTypes";

export default function SpecialitiesAndLanguages({
  counsellor,
  updateCounsellor,
}: {
  counsellor: Partial<counsellor>
  updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
  type Filter = { id: number; name: string; priority: number };
  const [languagesList, setLanguages] = useState<Filter[]>([]);
  const [specialtiesList, setSpecialties] = useState<Filter[]>([]);
  const maxEntries = 3;

  const fetchFilters = async () => {
    const filters = await getFilters();
    setLanguages(
      filters.languages?.sort(
        (a: Filter, b: Filter) => b.priority - a.priority
      ) || []
    );
    setSpecialties(
      filters.specialties?.sort(
        (a: Filter, b: Filter) => b.priority - a.priority
      ) || []
    );
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  // Get available languages for a specific index (excluding already selected ones)
  const getAvailableLanguages = (currentIndex: number) => {
    const selectedLanguages = (counsellor.languages || [])
      .map((lang, index) => index !== currentIndex ? lang.language : null)
      .filter(Boolean);

    return languagesList.filter(lang => !selectedLanguages.includes(lang.name));
  };

  // Get available specialties for a specific index (excluding already selected ones)
  const getAvailableSpecialties = (currentIndex: number) => {
    const selectedSpecialties = (counsellor.specialties || [])
      .map((specialty, index) => index !== currentIndex ? specialty : null)
      .filter(Boolean);

    return specialtiesList.filter(specialty => !selectedSpecialties.includes(specialty.name));
  };

  const addLanguage = (language: Language) => {
    const currentLanguages = counsellor.languages || [];
    if (currentLanguages.length >= maxEntries) {
      toast.error(`Maximum ${maxEntries} languages allowed`);
      return;
    }
    updateCounsellor("languages", [...currentLanguages, language]);
  };

  const updateLanguage = (index: number, updates: Partial<Language>) => {
    const updatedLanguages = [...(counsellor.languages || [])];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      ...updates
    };
    updateCounsellor("languages", updatedLanguages);
  };

  const deleteLanguage = (index: number) => {
    const updatedLanguages = (counsellor.languages || []).filter((_, i) => i !== index);
    updateCounsellor("languages", updatedLanguages);
  };

  const addSpecialty = (specialty: string) => {
    const currentSpecialties = counsellor.specialties || [];
    if (currentSpecialties.length >= maxEntries) {
      toast.error(`Maximum ${maxEntries} specialties allowed`);
      return;
    }
    updateCounsellor("specialties", [...currentSpecialties, specialty]);
  };

  const updateSpecialty = (index: number, value: string) => {
    const updatedSpecialties = [...(counsellor.specialties || [])];
    updatedSpecialties[index] = value;
    updateCounsellor("specialties", updatedSpecialties);
  };

  const deleteSpecialty = (index: number) => {
    const updatedSpecialties = (counsellor.specialties || []).filter((_, i) => i !== index);
    updateCounsellor("specialties", updatedSpecialties);
  };

  return (
    <div className="mx-auto p-4 sm:p-6 bg-white rounded-lg">
      {/* Languages Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Languages
          </h3>
          {(counsellor.languages?.length || 0) < maxEntries && (
            <button
              onClick={() =>
                addLanguage({ language: "", proficiencyLevel: "Basic" })
              }
              className="self-start sm:self-auto text-indigo-600 hover:text-indigo-800 transition flex items-center text-sm sm:text-base"
            >
              <IoAddCircleOutline className="mr-1" size={18} />
              Add Language
            </button>
          )}
        </div>

        {!counsellor.languages?.length && (
          <p className="text-gray-500 text-sm mt-2">No languages added.</p>
        )}

        <div className="space-y-3 sm:space-y-4">
          {counsellor.languages?.map((lang, index) => {
            const availableLanguages = getAvailableLanguages(index);

            return (
              <div
                key={index}
                className="bg-gray-100 p-3 sm:p-4 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-3">
                    <select
                      value={lang.language}
                      onChange={(e) =>
                        updateLanguage(index, { language: e.target.value })
                      }
                      className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" disabled>Select Language</option>
                      {/* Show current selection even if it would normally be filtered */}
                      {lang.language && !availableLanguages.find(l => l.name === lang.language) && (
                        <option value={lang.language}>{lang.language}</option>
                      )}
                      {availableLanguages.map((language) => (
                        <option key={language.id} value={language.name}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={lang.proficiencyLevel}
                      onChange={(e) =>
                        updateLanguage(index, {
                          proficiencyLevel: e.target.value as Language["proficiencyLevel"],
                        })
                      }
                      className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Basic">Basic</option>
                      <option value="Conversational">Conversational</option>
                      <option value="Professional">Professional</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Native">Native</option>
                    </select>
                  </div>
                  <div className="flex sm:flex-col justify-end sm:justify-start">
                    <button
                      onClick={() => deleteLanguage(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    >
                      <IoTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialties Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Specialties
          </h3>
          {(counsellor.specialties?.length || 0) < maxEntries && (
            <button
              onClick={() => addSpecialty("")}
              className="self-start sm:self-auto text-indigo-600 hover:text-indigo-800 transition flex items-center text-sm sm:text-base"
            >
              <IoAddCircleOutline className="mr-1" size={18} />
              Add Specialty
            </button>
          )}
        </div>

        {!counsellor.specialties?.length && (
          <p className="text-gray-500 text-sm mt-2">No specialties added.</p>
        )}

        <div className="space-y-3 sm:space-y-4">
          {counsellor.specialties?.map((specialty, index) => {
            const availableSpecialties = getAvailableSpecialties(index);

            return (
              <div
                key={index}
                className="bg-gray-100 p-3 sm:p-4 rounded-lg"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <select
                      value={specialty}
                      onChange={(e) => updateSpecialty(index, e.target.value)}
                      className="block w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" disabled>Select Specialty</option>
                      {/* Show current selection even if it would normally be filtered */}
                      {specialty && !availableSpecialties.find(s => s.name === specialty) && (
                        <option value={specialty}>{specialty}</option>
                      )}
                      {availableSpecialties.map((availableSpecialty) => (
                        <option key={availableSpecialty.id} value={availableSpecialty.name}>
                          {availableSpecialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex sm:flex-col justify-end sm:justify-start">
                    <button
                      onClick={() => deleteSpecialty(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                    >
                      <IoTrash size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
