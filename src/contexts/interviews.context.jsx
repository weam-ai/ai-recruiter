"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  const getAllInterviews = async (userId, organizationId) => {
    try {
      const response = await fetch(`/api/interviews?userId=${userId}&organizationId=${organizationId}`);
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
      const response = await fetch("/api/interviews", {
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
      const response = await fetch(`/api/interviews/${id}`, {
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
      await fetch(`/api/interviews/${id}`, { method: "DELETE" });
      setInterviews(prev => prev.filter(interview => interview.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting interview:", error);
      return false;
    }
  };

  const getInterviewById = async (id) => {
    try {
      const response = await fetch(`/api/interviews/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching interview by ID:", error);
      return null;
    }
  };

  const fetchInterviews = () => {
    console.log("fetchInterviews called");
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
    fetchInterviews,
  };

  return (
    <InterviewsContext.Provider value={value}>
      {children}
    </InterviewsContext.Provider>
  );
};
