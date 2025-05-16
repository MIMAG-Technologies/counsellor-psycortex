"use client";

import { PricingItem, Branches } from "@/app/apply/utils/counsellorTypes";
import { IoChatbubble, IoCall, IoVideocam, IoPerson } from "react-icons/io5";
import { counsellor } from "../utils/counsellorTypes";
import { useEffect, useState } from "react";
import { getBranches } from "../utils/counsellorUtils";

type CommunicationModes = {
  chat: boolean;
  call: boolean;
  video: boolean;
  in_person: boolean;
};

export default function ModeAndPricing({
  counsellor,
  updateCounsellor,
}: {
  counsellor: Partial<counsellor>
  updateCounsellor: (section: keyof counsellor, data: any) => void
}) {
  const [branches, setBranches] = useState<Branches>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      const branchesList = await getBranches();
      setBranches(branchesList);
    };
    fetchBranches();
  }, []);

  // Map modes to their respective labels and icons
  const modeDetails = {
    chat: { label: "Chat", icon: <IoChatbubble size={20} /> },
    call: { label: "Call", icon: <IoCall size={20} /> },
    video: { label: "Video", icon: <IoVideocam size={20} /> },
    in_person: { label: "In-Person", icon: <IoPerson size={20} /> },
  };

  const handleModeToggle = (mode: keyof CommunicationModes) => {
    const newModes = {
      ...counsellor.communicationModes,
      [mode]: !counsellor.communicationModes?.[mode]
    };
    updateCounsellor("communicationModes", newModes);

    // If mode is being disabled, remove its pricing items
    if (counsellor.communicationModes?.[mode]) {
      const updatedPricing = counsellor.pricing?.filter(
        item => item.typeOfAvailability !== mode
      ) || [];
      updateCounsellor("pricing", updatedPricing);
    }
  };

  const updatePricingItem = (index: number, updates: Partial<PricingItem>) => {
    const updatedPricing = [...(counsellor.pricing || [])];
    updatedPricing[index] = {
      ...updatedPricing[index],
      ...updates,
      currency: "INR" // Always set currency to INR
    };
    updateCounsellor("pricing", updatedPricing);
  };

  const addPricingItem = (mode: keyof CommunicationModes) => {
    const newPricingItem: PricingItem = {
      sessionType: "1 Hr Session",
      sessionTitle: `${modeDetails[mode].label} Session`,
      price: 0,
      currency: "INR",
      typeOfAvailability: mode
    };
    updateCounsellor("pricing", [...(counsellor.pricing || []), newPricingItem]);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Communication Modes Toggle Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Mode Buttons */}
        {Object.entries(modeDetails).map(([mode, { label, icon }]) => (
          <button
            key={mode}
            onClick={() => handleModeToggle(mode as keyof CommunicationModes)}
            className={`flex flex-col items-center p-4 rounded-lg shadow-md transition ${counsellor.communicationModes?.[mode as keyof CommunicationModes]
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700"
              } hover:shadow-lg`}
          >
            {icon}
            <span className="mt-2 text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Pricing Section */}
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Pricing</h3>
      {!counsellor.pricing?.length ? (
        <p className="text-gray-500 text-sm">No communication mode selected.</p>
      ) : (
        <ul className="space-y-6">
          {counsellor.pricing.map((priceItem, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              {/* Mode Label with Icon */}
              <div className="flex items-center mb-3">
                <span className="text-gray-800 font-medium flex items-center">
                  {modeDetails[priceItem.typeOfAvailability as keyof CommunicationModes]?.icon}
                  <span className="ml-2">
                    {modeDetails[priceItem.typeOfAvailability as keyof CommunicationModes]?.label}
                  </span>
                </span>
              </div>

              {/* Session Type */}
              <label className="block text-sm font-medium text-gray-600">
                Session Title
              </label>
              <input
                type="text"
                value={priceItem.sessionTitle}
                onChange={(e) =>
                  updatePricingItem(index, { sessionTitle: e.target.value })
                }
                className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 mb-3"
                placeholder="Enter session title"
              />

              {/* Pricing Fields */}
              <div className="grid grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Price (INR)
                  </label>
                  <input
                    type="text"
                    value={priceItem.price || 0}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      updatePricingItem(index, {
                        price: value === "" ? 0 : parseFloat(value),
                      });
                    }}
                    className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder="Enter price"
                  />
                </div>

                {/* Currency (Disabled) */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Currency
                  </label>
                  <select
                    value="INR"
                    disabled
                    className="block w-full px-3 py-2 border rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    <option value="INR">INR</option>
                  </select>
                </div>

                {priceItem.typeOfAvailability === "in_person" && (
                  <div className="mt-4 col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Preferred Center
                    </h3>
                    <select
                      value={counsellor.preferredCenterAddress?.street_address || ""}
                      onChange={(e) => {
                        const selectedBranch = branches.find(b => b.street_address === e.target.value);
                        if (selectedBranch) {
                          updateCounsellor("preferredCenterAddress", {
                            street_address: selectedBranch.street_address,
                            city: selectedBranch.city,
                            state: selectedBranch.state,
                            pincode: selectedBranch.pincode
                          });
                        }
                      }}
                      className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    >
                      <option value="">Select a center</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.street_address}>
                          {branch.branch_name} - {branch.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add Pricing Button */}
      {Object.entries(modeDetails).map(([mode, { label }]) => (
        counsellor.communicationModes?.[mode as keyof CommunicationModes] &&
        !counsellor.pricing?.some(item => item.typeOfAvailability === mode) && (
          <button
            key={mode}
            onClick={() => addPricingItem(mode as keyof CommunicationModes)}
            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200"
          >
            Add {label} Pricing
          </button>
        )
      ))}
    </div>
  );
}
