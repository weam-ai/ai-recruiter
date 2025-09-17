"use client";

import { TestAvatar } from "@/components/interview-avatar/TestAvatar";

export default function TestAvatarPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">HeyGen Avatar Integration Test</h1>
        <TestAvatar />
      </div>
    </div>
  );
}
