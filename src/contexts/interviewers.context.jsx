"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const InterviewersContext = createContext({
  interviewers: [],
  setInterviewers: () => {},
  getAllInterviewers: async () => {},
  createInterviewer: async () => {},
  interviewersLoading: false,
  setInterviewersLoading: () => {},
});

export const useInterviewers = () => useContext(InterviewersContext);

export const InterviewersProvider = ({ children }) => {
  const [interviewers, setInterviewers] = useState([]);
  const [interviewersLoading, setInterviewersLoading] = useState(false);

  const getAllInterviewers = useCallback(async (clientId = "") => {
    try {
      console.log("getAllInterviewers called with clientId:", clientId);
      setInterviewersLoading(true);
      
      const response = await fetch(
        `/api/interviewers?clientId=${clientId}`
      );
      
      console.log("API response status:", response.status);
      console.log("API response ok:", response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        setInterviewers(data);
        console.log("Interviewers state updated:", data);
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
      const response = await fetch("/api/interviewers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const newInterviewer = await response.json();
        setInterviewers((prev) => [newInterviewer, ...prev]);
      }
    } catch (error) {
      console.error("Error creating interviewer:", error);
    }
  }, []); // Empty dependency array

  console.log("InterviewersContext render:", { interviewers, interviewersLoading });

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
