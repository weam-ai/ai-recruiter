import React, { useEffect, useState, useRef } from "react";
import LoaderWithLogo from "@/components/loaders/loader-with-logo/loaderWithLogo";
import DetailsPopup from "@/components/dashboard/interview/create-popup/details";
import QuestionsPopup from "@/components/dashboard/interview/create-popup/questions";
import { InterviewBase } from "@/types/interview";
import Modal from "@/components/dashboard/Modal";
import { useInterviewers } from "@/contexts/interviewers.context";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateEmptyInterviewData = (): InterviewBase => ({
  user_id: "",
  organization_id: "",
  name: "",
  interviewer_id: "68b716ba68f8519199d3afd7", // Default to Lisa's MongoDB ObjectId
  objective: "",
  question_count: 0,
  time_duration: "",
  is_anonymous: false,
  questions: [],
  description: "",
  response_count: BigInt(0),
});

function CreateInterviewModal({ open, setOpen }: Props) {
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewBase>(
    CreateEmptyInterviewData(),
  );
  const { interviewers, getAllInterviewers } = useInterviewers();
  const hasLoadedInterviewers = useRef(false);

  // Debug logging
  console.log("CreateInterviewModal render:", { open, interviewersCount: interviewers?.length });

  // Below for File Upload
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

  // Load interviewers only once when modal opens
  useEffect(() => {
    if (open && !hasLoadedInterviewers.current) {
      console.log("Modal opened, loading interviewers...");
      getAllInterviewers();
      hasLoadedInterviewers.current = true;
    }
  }, [open]); // Only depend on 'open', not 'getAllInterviewers'

  useEffect(() => {
    if (loading == true) {
      setLoading(false);
      setProceed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewData]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setProceed(false);
      setInterviewData(CreateEmptyInterviewData());
      // Below for File Upload
      setIsUploaded(false);
      setFileName("");
      // Reset the flag when modal closes
      hasLoadedInterviewers.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    console.log("Modal close handler called");
    setOpen(false);
  };

  console.log("Modal should be visible:", open, "Interviewers available:", interviewers?.length);

  return (
    <Modal open={open} onClose={handleClose}>
      {loading ? (
        <div className="w-[38rem] h-[35.3rem]">
          <LoaderWithLogo />
        </div>
      ) : !proceed ? (
        <DetailsPopup
          open={open}
          setLoading={setLoading}
          interviewData={interviewData}
          setInterviewData={setInterviewData}
          // Below for File Upload
          isUploaded={isUploaded}
          setIsUploaded={setIsUploaded}
          fileName={fileName}
          setFileName={setFileName}
        />
      ) : (
        <QuestionsPopup
          interviewData={interviewData}
          setProceed={setProceed}
          setOpen={setOpen}
        />
      )}
    </Modal>
  );
}

export default CreateInterviewModal;
