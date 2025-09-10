"use client";

import { Card, CardContent } from "../../ui/card";
import axios from "axios";
import { Plus, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useInterviewers } from "../../../contexts/interviewers.context.jsx";
import { getApiUrl } from "@/lib/utils";

function CreateInterviewerButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdData, setCreatedData] = useState(null);
  const { getAllInterviewers } = useInterviewers();

  const createInterviewers = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setCreatedData(null);
    
    try {
      const response = await axios.get(getApiUrl("/api/create-interviewer"), {});
      // console.log("Interviewers created:", response.data);
      
      if (response.status === 200) {
        setIsSuccess(true);
        setCreatedData(response.data);
        
        // Show success message with real data
        const lisaName = response.data.lisa?.name || response.data.newInterviewer?.name || "Lisa";
        const bobName = response.data.bob?.name || response.data.newSecondInterviewer?.name || "Bob";
        
        alert(`🎉 Successfully created interviewers!\n\n${lisaName}: Explorer with voice Chloe\n${bobName}: Empathetic with voice Brian\n\nBoth interviewers are now available for your interviews!`);
        
        // Refresh the interviewers list to show the new ones
        // console.log("Refreshing interviewers list...");
        await getAllInterviewers();
        
        // Reset after showing the alert
        setTimeout(() => {
          setIsSuccess(false);
          setCreatedData(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating interviewers:", error);
      
      // Show more detailed error information
      let errorMessage = "Failed to create interviewers. ";
      if (error.response?.data?.error) {
        errorMessage += error.response.data.error;
        if (error.response.data.details) {
          errorMessage += `\n\nDetails: ${error.response.data.details}`;
        }
      } else {
        errorMessage += "Please check your console for more details.";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        className="p-0 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 h-40 w-36 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md"
        onClick={() => createInterviewers()}
      >
        <CardContent className="p-0">
          {isLoading ? (
            <div className="w-full h-20 overflow-hidden flex justify-center items-center">
              <Loader2 size={40} className="animate-spin" />
            </div>
          ) : isSuccess ? (
            <div className="w-full h-20 overflow-hidden flex justify-center items-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
          ) : (
            <div className="w-full h-20 overflow-hidden flex justify-center items-center">
              <Plus size={40} />
            </div>
          )}
          <p className="my-3 mx-auto text-xs text-wrap w-fit text-center">
            {isSuccess ? "Interviewers Created!" : "Create two Default Interviewers"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export default CreateInterviewerButton;
