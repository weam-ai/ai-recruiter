"use client";

import React, { createContext, useContext, useState } from "react";
import { getApiUrl } from "@/lib/utils";

const ClientsContext = createContext({
  user: null,
  organization: null,
  setUser: () => {},
  setOrganization: () => {},
  getClientById: async () => {},
  getOrganizationById: async () => {},
  updateOrganization: async () => {},
  clientLoading: false,
  setClientLoading: () => {},
});

export const useClients = () => useContext(ClientsContext);

export const ClientsProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [clientLoading, setClientLoading] = useState(false);

  const getClientById = async (id, email = null, organizationId = null) => {
    try {
      setClientLoading(true);
      const params = new URLSearchParams({ id });
      if (email) params.append('email', email);
      if (organizationId) params.append('organizationId', organizationId);
      
      const response = await fetch(getApiUrl(`/api/clients?${params.toString()}`));
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setClientLoading(false);
    }
  };

  const getOrganizationById = async (organizationId = null, organizationName = null) => {
    try {
      setClientLoading(true);
      const params = new URLSearchParams();
      if (organizationId) params.append('organizationId', organizationId);
      if (organizationName) params.append('organizationName', organizationName);
      
      const response = await fetch(getApiUrl(`/api/clients?${params.toString()}`), {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    } finally {
      setClientLoading(false);
    }
  };

  const updateOrganization = async (id, updates) => {
    try {
      const response = await fetch(getApiUrl(`/api/organizations/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
      }
    } catch (error) {
      console.error("Error updating organization:", error);
    }
  };

  return (
    <ClientsContext.Provider
      value={{
        user,
        organization,
        setUser,
        setOrganization,
        getClientById,
        getOrganizationById,
        updateOrganization,
        clientLoading,
        setClientLoading,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};
