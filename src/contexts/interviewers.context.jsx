"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { getApiUrl } from "@/lib/utils";

const InterviewersContext = createContext({
  interviewers: [],
  setInterviewers: () => {},
  getAllInterviewers: async (companyId) => {},
  createInterviewer: async (payload) => {},
  interviewersLoading: false,
  setInterviewersLoading: () => {},
});

export const useInterviewers = () => useContext(InterviewersContext);

export const InterviewersProvider = ({ children }) => {
  const [interviewers, setInterviewers] = useState([]);
  const [interviewersLoading, setInterviewersLoading] = useState(false);

  const getAllInterviewers = useCallback(async (companyId = "") => {
    try {
      // console.log("getAllInterviewers called with companyId:", companyId);
      setInterviewersLoading(true);
      
      const response = await fetch(
        getApiUrl(`/api/interviewers?companyId=${companyId}`)
      );
      
      // console.log("API response status:", response.status);
      // console.log("API response ok:", response.ok);
      
      if (response.ok) {
        const data = await response.json();
        // console.log("API response data:", data);
        setInterviewers(data);
        // console.log("Interviewers state updated:", data);
      } else {
        console.error("API response not ok:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
      }
    } catch (error) {
      console.error("Error fetching interviewers:", error);
    } finally {
      setInterviewersLoading(false);
    }
  }, []); // Empty dependency array since this function doesn't depend on any state

  const createInterviewer = useCallback(async (payload) => {
    try {
      const response = await fetch(getApiUrl("/api/interviewers"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const newInterviewer = await response.json();
        setInterviewers((prev) => [newInterviewer, ...prev]);
        return newInterviewer;
      } else {
        const errorData = await response.json();
        console.error('Error creating interviewer:', errorData);
        throw new Error(errorData.error || 'Failed to create interviewer');
      }
    } catch (error) {
      console.error("Error creating interviewer:", error);
      throw error;
    }
  }, []); // Empty dependency array

  // console.log("InterviewersContext render:", { interviewers, interviewersLoading });

  return (
    <InterviewersContext.Provider
      value={{
        interviewers,
        setInterviewers,
        getAllInterviewers,
        createInterviewer,
        interviewersLoading,
        setInterviewersLoading,
      }}
    >
      {children}
    </InterviewersContext.Provider>
  );
};
