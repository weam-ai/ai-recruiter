"use client";

import React, { createContext, useContext, useState } from "react";
import { getApiUrl } from "@/lib/utils";

const ResponsesContext = createContext({
  responses: [],
  setResponses: () => {},
  getAllResponses: async (interviewId) => {},
  getResponseByCallId: async (callId) => null,
  createResponse: async (payload) => null,
  saveResponse: async (payload, callId) => null,
  updateResponse: async (id, updates) => false,
  deleteResponse: async (id) => false,
});

export const useResponses = () => useContext(ResponsesContext);

export const ResponsesProvider = ({ children }) => {
  const [responses, setResponses] = useState([]);

  const getAllResponses = async (interviewId) => {
    try {
      const response = await fetch(
        getApiUrl(`/api/responses?interviewId=${interviewId}`)
      );
      if (response.ok) {
        const data = await response.json();
        setResponses(data);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  const getResponseByCallId = async (callId) => {
    try {
      const response = await fetch(getApiUrl(`/api/responses/call/${callId}`));
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching response by call ID:", error);
      return null;
    }
  };

  const createResponse = async (payload) => {
    try {
      // First try the public API route (no authentication required)
      let response = await fetch(getApiUrl("/api/public/responses"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        // If public route fails, try the authenticated route
        response = await fetch(getApiUrl("/api/responses"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }
      
      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
      return null;
    } catch (error) {
      console.error("Error creating response:", error);
      return null;
    }
  };

  const saveResponse = async (payload, callId) => {
    try {
      const response = await fetch(getApiUrl(`/api/responses/call/${callId}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        return data.success;
      }
      return null;
    } catch (error) {
      console.error("Error saving response:", error);
      return null;
    }
  };

  const updateResponse = async (id, updates) => {
    try {
      const response = await fetch(getApiUrl(`/api/responses/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      return response.ok;
    } catch (error) {
      console.error("Error updating response:", error);
      return false;
    }
  };

  const deleteResponse = async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/responses/${id}`), {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting response:", error);
      return false;
    }
  };

  return (
    <ResponsesContext.Provider
      value={{
        responses,
        setResponses,
        getAllResponses,
        getResponseByCallId,
        createResponse,
        saveResponse,
        updateResponse,
        deleteResponse,
      }}
    >
      {children}
    </ResponsesContext.Provider>
  );
};
