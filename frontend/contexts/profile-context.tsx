"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export interface CognitiveProfile {
  text: {
    chunking: {
      strategy: "sentence_limit" | "none";
      maxLength: number;
    };
    vocabulary: {
      simplificationLevel: "none" | "basic" | "intermediate" | "advanced";
    };
  };
  simplification: {
    useAnalogies: boolean;
    summarization: {
      defaultState: "collapsed" | "expanded";
      summaryLength: number;
    };
  };
  visuals: {
    distractionFilter: {
      enabled: boolean;
      sensitivity: "low" | "medium" | "high";
    };
  };
  preferences: {
    fontSize: number;
    lineHeight: number;
    colorScheme: "default" | "high-contrast" | "warm";
  };
}

interface ProfileContextType {
  profile: CognitiveProfile | null;
  setProfile: (profile: CognitiveProfile) => void;
  updateProfile: (updates: Partial<CognitiveProfile>) => void;
  isLoading: boolean;
}

const defaultProfile: CognitiveProfile = {
  text: {
    chunking: {
      strategy: "none",
      maxLength: 5,
    },
    vocabulary: {
      simplificationLevel: "none",
    },
  },
  simplification: {
    useAnalogies: false,
    summarization: {
      defaultState: "expanded",
      summaryLength: 100,
    },
  },
  visuals: {
    distractionFilter: {
      enabled: false,
      sensitivity: "medium",
    },
  },
  preferences: {
    fontSize: 16,
    lineHeight: 1.5,
    colorScheme: "default",
  },
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<CognitiveProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage on mount
    const savedProfile = localStorage.getItem("cogniweave-profile");
    if (savedProfile) {
      try {
        setProfileState(JSON.parse(savedProfile));
      } catch (error) {
        console.error("Failed to parse saved profile:", error);
        setProfileState(defaultProfile);
      }
    }
    setIsLoading(false);
  }, []);

  const setProfile = (newProfile: CognitiveProfile) => {
    setProfileState(newProfile);
    localStorage.setItem("cogniweave-profile", JSON.stringify(newProfile));
  };

  const updateProfile = (updates: Partial<CognitiveProfile>) => {
    if (!profile) return;

    // Deep merge function to properly handle nested objects
    const deepMerge = (target: any, source: any): any => {
      const result = { ...target };

      for (const key in source) {
        if (
          source[key] &&
          typeof source[key] === "object" &&
          !Array.isArray(source[key])
        ) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }

      return result;
    };

    const updatedProfile = deepMerge(profile, updates);
    setProfile(updatedProfile);
  };

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, updateProfile, isLoading }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
