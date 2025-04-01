"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";
import { auth } from "@/firebaseConfig";
import { Me } from "@/types/profile/profile";

interface AuthContextProps {
  user: User | null;
  me: Me | null;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);      
      setLoading(true);
      if (currentUser) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/counsellor/is_counsellor.php?firebaseUid=${currentUser.uid}`
          );
          if (res.data.isCounsellor) {
            setMe(res.data.counsellorDetails);
          }
setMe({
  id: "c123456",
  name: "Sarah JohnSon",
  email: "nagrikar1403@gmail.com",
  isVerified: true,
  documentsVerified: true
});
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      } else {
        setMe(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, me, loading, setLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
