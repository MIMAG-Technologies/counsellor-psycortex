/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { useAuth } from "@/context/AuthContext";
import { Session, SessionMode, SessionStatus } from "@/types/sessions";
import { fetchSessions } from "@/utils/sessions/index";
import { SessionCard, SessionFilters, NoSessions } from "@/components/sessions";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<SessionMode | string>("video");
  const [activeStatus, setActiveStatus] = useState<SessionStatus | string>("upcoming");
  const { me } = useAuth();

  useEffect(() => {
    const getData = async () => {
      if (me?.id) {
        setLoading(true);
        const data = await fetchSessions({
          counsellorId: me.id,
          mode: activeMode,
          status: activeStatus
        });
        setSessions(data);
        setLoading(false);
      }
    };
    getData();
  }, [activeMode, activeStatus, me?.id]);

  const handleModeChange = (mode: string) => {
    setActiveMode(mode);
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
  };

  return (
    <>
      <h1 className="text-2xl text-indigo-500 font-semibold mb-6">My Sessions</h1>

      <SessionFilters 
        activeMode={activeMode}
        activeStatus={activeStatus}
        onModeChange={handleModeChange}
        onStatusChange={handleStatusChange}
      />

      <div className="mt-10">
        {loading ? (
          <Loader/>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                activeMode={activeMode} 
                activeStatus={activeStatus} 
              />
            ))}
          </div>
        ) : (
          <NoSessions status={activeStatus} />
        )}
      </div>
    </>
  );
};

export default Sessions; 