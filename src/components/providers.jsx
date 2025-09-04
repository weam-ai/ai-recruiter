"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import compose from "../lib/compose.jsx";
import { InterviewersProvider } from "../contexts/interviewers.context.jsx";
import { InterviewsProvider } from "../contexts/interviews.context.jsx";
import { ResponsesProvider } from "../contexts/responses.context.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ClientsProvider } from "../contexts/clients.context.jsx";

const queryClient = new QueryClient();

const providers = ({ children }) => {
  const Provider = compose([
    InterviewsProvider,
    InterviewersProvider,
    ResponsesProvider,
    ClientsProvider,
  ]);

  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <Provider>{children}</Provider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
};

export default providers;
