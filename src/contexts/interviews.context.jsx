"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getApiUrl } from "@/lib/utils";

const InterviewsContext = createContext();

export const useInterviews = () => {
  const context = useContext(InterviewsContext);
  if (!context) {
    throw new Error("useInterviews must be used within an InterviewsProvider");
  }
  return context;
};

export const InterviewsProvider = ({ children }) => {
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);

  const getAllInterviews = async (companyId) => {
    try {
      const response = await fetch(getApiUrl(`/api/interviews?companyId=${companyId}`));
      const data = await response.json();
      setInterviews(data);
      return data;
    } catch (error) {
      console.error("Error fetching interviews:", error);
      return [];
    }
  };

  const createInterview = async (interviewData) => {
    try {
      const response = await fetch(getApiUrl("/api/interviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewData),
      });
      const newInterview = await response.json();
      setInterviews(prev => [...prev, newInterview]);
      return newInterview;
    } catch (error) {
      console.error("Error creating interview:", error);
      return null;
    }
  };

  const updateInterview = async (id, updates) => {
    try {
      const response = await fetch(getApiUrl(`/api/interviews/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const updatedInterview = await response.json();
      setInterviews(prev => prev.map(interview => 
        interview.id === id ? updatedInterview : interview
      ));
      return updatedInterview;
    } catch (error) {
      console.error("Error updating interview:", error);
      return null;
    }
  };

  const deleteInterview = async (id) => {
    try {
      await fetch(getApiUrl(`/api/interviews/${id}`), { method: "DELETE" });
      setInterviews(prev => prev.filter(interview => interview.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting interview:", error);
      return false;
    }
  };

  const getInterviewById = async (id, token = null) => {
    try {
      // Build URL with token if provided
      const url = token 
        ? getApiUrl(`/api/public/interviews/${id}?token=${token}`)
        : getApiUrl(`/api/public/interviews/${id}`);
        
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      // If public route fails, try the authenticated route
      const authResponse = await fetch(getApiUrl(`/api/interviews/${id}`));
      if (authResponse.ok) {
        const data = await authResponse.json();
        return data;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching interview by ID:", error);
      
      // No fallback data - return null if interview not found
      
      return null;
    }
  };

  const generateSecureUrl = async (interviewId) => {
    try {
      const response = await fetch(getApiUrl(`/api/interviews/${interviewId}/generate-token`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        return null;
      }
    } catch (error) {
      console.error("Error generating secure URL:", error);
      return null;
    }
  };

  const fetchInterviews = async (companyId) => {
    // console.log("fetchInterviews called with:", { companyId });
    if (companyId) {
      await getAllInterviews(companyId);
    }
  };

  const value = {
    interviews,
    interviewsLoading,
    setInterviewsLoading,
    getAllInterviews,
    createInterview,
    updateInterview,
    deleteInterview,
    getInterviewById,
    generateSecureUrl,
    fetchInterviews,
  };

  return (
    <InterviewsContext.Provider value={value}>
      {children}
    </InterviewsContext.Provider>
  );
};
