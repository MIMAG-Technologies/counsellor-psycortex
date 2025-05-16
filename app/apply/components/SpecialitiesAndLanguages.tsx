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
    <div className="mx-auto p-6 bg-white rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Languages
          {(counsellor.languages?.length || 0) < maxEntries && (
            <button
              onClick={() =>
                addLanguage({ language: "", proficiencyLevel: "Basic" })
              }
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {!counsellor.languages?.length && (
          <p className="text-gray-500 text-sm mt-2">No languages added.</p>
        )}

        {counsellor.languages?.map((lang, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <select
                value={lang.language}
                onChange={(e) =>
                  updateLanguage(index, { language: e.target.value })
                }
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>Select Language</option>
                {languagesList.map((language) => (
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
                className="block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Professional">Professional</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native</option>
              </select>
            </div>
            <button
              onClick={() => deleteLanguage(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>

      {/* Specialties Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 flex justify-between items-center">
          Specialties
          {(counsellor.specialties?.length || 0) < maxEntries && (
            <button
              onClick={() => addSpecialty("")}
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <IoAddCircleOutline className="mr-1" size={20} />
              Add
            </button>
          )}
        </h3>

        {!counsellor.specialties?.length && (
          <p className="text-gray-500 text-sm mt-2">No specialties added.</p>
        )}

        {counsellor.specialties?.map((specialty, index) => (
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg mt-3 flex flex-col sm:flex-row items-center sm:items-start"
          >
            <div className="flex-1">
              <select
                value={specialty}
                onChange={(e) => updateSpecialty(index, e.target.value)}
                className="block w-full px-4 py-2 mb-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>Select Specialty</option>
                {specialtiesList.map((specialty) => (
                  <option key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => deleteSpecialty(index)}
              className="ml-4 text-red-600 hover:text-red-800 transition"
            >
              <IoTrash size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
