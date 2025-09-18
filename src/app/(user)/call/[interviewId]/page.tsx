"use client";

import { useInterviews } from "@/contexts/interviews.context";
import { useEffect, useState } from "react";
import Call from "@/components/call";
import Image from "next/image";
import { ArrowUpRightSquareIcon } from "lucide-react";
import { Interview } from "@/types/interview";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { getImageUrl, getApiUrl } from "@/lib/utils";

type Props = {
  params: {
    interviewId: string;
  };
};

type PopupProps = {
  title: string;
  description: string;
  image: string;
};

function PopupLoader() {
  return (
    <div className="bg-white rounded-md absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 md:w-[80%] w-[90%]">
      <div className="h-[88vh] justify-center items-center rounded-lg border-2 border-b-4 border-r-4 border-black font-bold transition-all md:block dark:border-white">
        <div className="relative flex flex-col items-center justify-center h-full">
          <LoaderWithText />
        </div>
      </div>
      {/* <a
        className="flex flex-row justify-center align-middle mt-3"
        href="https://folo-up.co/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="text-center text-md font-semibold mr-2">
          Powered by{" "}
          <span className="font-bold">
            Folo<span className="text-indigo-600">Up</span>
          </span>
        </div>
        <ArrowUpRightSquareIcon className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-indigo-500" />
      </a> */}
    </div>
  );
}

function PopUpMessage({ title, description, image }: PopupProps) {
  return (
    <div className="bg-white rounded-md absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 md:w-[80%] w-[90%]">
      <div className="h-[88vh] content-center rounded-lg border-2 border-b-4 border-r-4 border-black font-bold transition-all  md:block dark:border-white ">
        <div className="flex flex-col items-center justify-center my-auto">
          <Image
            src={getImageUrl(image)}
            alt="Graphic"
            width={200}
            height={200}
            className="mb-4"
          />
          <h1 className="text-md font-medium mb-2">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      {/* <a
        className="flex flex-row justify-center align-middle mt-3"
        href="https://folo-up.co/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="text-center text-md font-semibold mr-2">
          Powered by{" "}
          <span className="font-bold">
            Folo<span className="text-indigo-600">Up</span>
          </span>
        </div>
        <ArrowUpRightSquareIcon className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-indigo-500" />
      </a> */}
    </div>
  );
}

function InterviewInterface({ params }: Props) {
  const [interview, setInterview] = useState<Interview>();
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { getInterviewById } = useInterviews();
  const [interviewNotFound, setInterviewNotFound] = useState(false);
  
  useEffect(() => {
    if (interview) {
      setIsActive(interview?.is_active === true);
    }
  }, [interview, params.interviewId]);

  useEffect(() => {
    const fetchinterview = async () => {
      try {
        setIsLoading(true);
        
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        // Build the URL with token if present
        const interviewUrl = token 
          ? getApiUrl(`/api/public/interviews/${params.interviewId}?token=${token}`)
          : getApiUrl(`/api/public/interviews/${params.interviewId}`);
        
        const response = await fetch(interviewUrl);
        
        if (response.ok) {
          const interviewData = await response.json();
          setInterview(interviewData);
          
          // Note: Token will be marked as used when user actually starts the interview
          // This is handled in the Call component when the interview begins
          
          // Only set document.title on client side
          if (typeof window !== 'undefined') {
            document.title = interviewData.name;
          }
        } else if (response.status === 403) {
          // Handle token-related errors
          const errorData = await response.json();
          if (errorData.requires_token) {
            setInterviewNotFound(true);
          } else {
            setInterviewNotFound(true);
          }
        } else {
          setInterviewNotFound(true);
        }
      } catch (error) {
        console.error(error);
        setInterviewNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchinterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading state during initial load to prevent hydration mismatch
  if (isLoading) {
    return (
      <div>
        <div className="hidden md:block p-8 mx-auto form-container">
          <PopupLoader />
        </div>
        <div className="md:hidden flex flex-col items-center justify-center my-auto">
          <div className="mt-48 px-3">
            <p className="text-center my-5 text-md font-semibold">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden md:block p-8 mx-auto form-container">
        {interviewNotFound ? (
          <PopUpMessage
            title="Access Denied"
            description="This interview link is no longer available. It may have been used already, expired, or the URL is invalid. Please contact the sender for a new link."
            image="/invalid-url.png"
          />
        ) : !isActive ? (
          <PopUpMessage
            title="Interview Is Unavailable"
            description="We are not currently accepting responses. Please contact the sender for more information."
            image="/closed.png"
          />
        ) : interview ? (
          <Call interview={interview} />
        ) : (
          <PopupLoader />
        )}
      </div>
      <div className="md:hidden flex flex-col items-center justify-center my-auto">
        <div className="mt-48 px-3">
          <p className="text-center my-5 text-md font-semibold">
            {interview?.name || "Loading..."}
          </p>
          <p className="text-center text-gray-600 my-5">
            Please use a PC to respond to the interview. Apologies for any
            inconvenience caused.{" "}
          </p>
        </div>
        {/* <div className="text-center text-md font-semibold mr-2 my-5">
          Powered by{" "}
          <a
            className="font-bold underline"
            href="www.folo-up.co"
            target="_blank"
          >
            Folo<span className="text-indigo-600">Up</span>
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default InterviewInterface;
