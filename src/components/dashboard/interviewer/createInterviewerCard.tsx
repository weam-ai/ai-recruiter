/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as LucideImage } from "lucide-react";
import { Plus } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { avatars } from "@/components/dashboard/interviewer/avatars";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInterviewers } from "@/contexts/interviewers.context";
import { useClerk } from "@/contexts/auth.context";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

interface CreateInterviewerCardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showPlusIcon?: boolean;
}

const createInterviewerCard = ({ open: openProp, onOpenChange, showPlusIcon = true }: CreateInterviewerCardProps = {} as CreateInterviewerCardProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;
  
  // Handle dialog open/close changes
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const [gallery, setGallery] = useState(false);
  const [name, setName] = useState("");
  const [empathy, setEmpathy] = useState(0.4);
  const [rapport, setRapport] = useState(0.7);
  const [exploration, setExploration] = useState(0.2);
  const [speed, setSpeed] = useState(0.9);
  const [image, setImage] = useState("");
  const { createInterviewer } = useInterviewers();
  const { user } = useClerk();
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmpathy(0.4);
      setRapport(0.7);
      setExploration(0.2);
      setSpeed(0.9);
      setImage("");
    }
  }, [open]);


  const onSave = async () => {
    try {
      await createInterviewer({
        name: name,
        empathy: empathy * 10,
        rapport: rapport * 10,
        exploration: exploration * 10,
        speed: speed * 10,
        user: {
          id: user?._id || "",
          email: user?.email || "",
        },
        image: image,
      });
      setIsClicked(false);
      handleOpenChange(false);
    } catch (error: any) {
      console.error('Error creating interviewer:', error);
      setIsClicked(false);
      
      // Handle API key validation errors
      if (error.message && error.message.includes('Missing API Configuration')) {
        toast.error(
          `Missing API Configuration`,
          {
            description: error.message,
            duration: 5000,
          }
        );
      } else {
        toast.error(
          "Failed to create interviewer",
          {
            description: error.message || "An error occurred while creating the interviewer. Please try again.",
            duration: 4000,
          }
        );
      }
    }
  };

  return (
    <>
      {/* Plus icon display without DialogTrigger - conditionally rendered */}
      {showPlusIcon && (
        <Plus size={36} className="mx-auto text-gray-600 mb-4" />
      )}
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-[35rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center">
              Create an interviewer yourself!
            </DialogTitle>
            <DialogDescription className="text-center">
              Customize your interviewer's personality and appearance
            </DialogDescription>
          </DialogHeader>
          <div className="text-center">
          <div className="mt-3 p-2 flex flex-row justify-center space-x-8 items-center">
            <div
              className=" flex flex-col items-center justify-center overflow-hidden border-4 border-gray-500 rounded-xl h-36 w-36"
              onClick={() => setGallery(true)}
            >
              {image ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={image}
                    alt="Picture of the interviewer"
                    width={140}
                    height={140}
                    className="w-full h-full object-cover object-center rounded-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div>
                  <LucideImage
                    className="mt-2 text-gray-300"
                    size={70}
                    strokeWidth={0.7}
                  />
                  <h4 className="text-xs text-center font-medium text-gray-400">
                    Choose an Avatar
                  </h4>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center items-start ml-4">
              <div className="flex flex-row justify-center items-center">
                <h3 className="text-lg font-medium">Name</h3>
                <input
                  type="text"
                  className="border-b-2 focus:outline-none border-gray-500 px-2 py-0.5 ml-3 w-[12.5rem]"
                  placeholder="e.g. Empathetic Bob"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <h3 className="text-lg mt-3 font-medium">Interviewer Settings</h3>
              <div className="ml-5 mt-2 flex flex-col justify-start items-start">
                <div className="flex flex-row justify-between items-center mb-2">
                  <h4 className="w-20 text-left">Empathy</h4>
                  <div className="w-40 space-x-3 ml-3 flex justify-between items-center">
                    <Slider
                      value={[empathy]}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => setEmpathy(value[0])}
                    />
                    <span className="w-8 text-left">{empathy}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-2">
                  <h4 className="w-20 text-left">Rapport</h4>
                  <div className="w-40 space-x-3 ml-3 flex justify-between items-center">
                    <Slider
                      value={[rapport]}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => setRapport(value[0])}
                    />
                    <span className="w-8 text-left">{rapport}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-2">
                  <h4 className="w-20 text-left">Exploration</h4>
                  <div className="w-40 space-x-3 ml-3 flex justify-between items-center">
                    <Slider
                      value={[exploration]}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => setExploration(value[0])}
                    />
                    <span className="w-8 text-left">{exploration}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mb-2">
                  <h4 className="w-20 text-left">Speed</h4>
                  <div className="w-40 space-x-3 ml-3 flex justify-between items-center">
                    <Slider
                      value={[speed]}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => setSpeed(value[0])}
                    />
                    <span className="w-8 text-left">{speed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="flex flex-row justify-end mr-4">
              <Button
                disabled={(name && image ? false : true) || isClicked}
                className="bg-gray-800  hover:bg-black"
                onClick={() => {
                  setIsClicked(true);
                  onSave();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={gallery} onOpenChange={setGallery}>
        <DialogContent className="max-w-[24rem] max-h-[20rem]">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold">
              Select an Avatar
            </DialogTitle>
            <DialogDescription className="text-sm">
              Choose an avatar for your interviewer
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-4 gap-3 p-2">
              {avatars.map((item, key) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-black transition-colors p-2"
                  onClick={() => {
                    setImage(item.img);
                    setGallery(false);
                  }}
                >
                  <Image alt="avatar" width={70} height={70} src={item.img} className="object-cover" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { createInterviewerCard, type CreateInterviewerCardProps };
export default createInterviewerCard;
