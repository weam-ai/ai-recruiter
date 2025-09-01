"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

function CreateInterviewCard() {
  return (
    <Card className="h-60 w-56 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:scale-105 transition-all duration-200 cursor-pointer bg-white shadow-sm">
      <CardContent className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <Plus size={48} className="mx-auto text-black mb-4" />
          <p className="text-gray-700 font-medium text-base">Create an Interview</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreateInterviewCard;
