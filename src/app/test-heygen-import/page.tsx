"use client";

import React, { useState, useEffect } from "react";

export default function TestHeyGenImport() {
  const [importTest, setImportTest] = useState<any>(null);

  useEffect(() => {
    const testImports = async () => {
      try {
        // Test if we can import the HeyGen package
        const { StreamingAvatar, StreamingEvents, AvatarQuality } = await import("@heygen/streaming-avatar");
        
        setImportTest({
          success: true,
          message: "HeyGen imports successful!",
          data: {
            StreamingAvatar: typeof StreamingAvatar,
            StreamingEvents: typeof StreamingEvents,
            AvatarQuality: typeof AvatarQuality,
            hasDefaultExport: StreamingAvatar !== undefined,
          }
        });
      } catch (error) {
        setImportTest({
          success: false,
          error: `Import failed: ${error.message}`
        });
      }
    };

    testImports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            HeyGen Package Import Test
          </h1>
          
          {importTest ? (
            <div className={`p-4 rounded-lg border ${
              importTest.success 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  importTest.success ? "bg-green-500" : "bg-red-500"
                }`}></div>
                <h3 className={`font-semibold ${
                  importTest.success ? "text-green-800" : "text-red-800"
                }`}>
                  {importTest.success ? "✅ Imports Working!" : "❌ Import Error"}
                </h3>
              </div>
              
              <div className={`text-sm ${
                importTest.success ? "text-green-700" : "text-red-700"
              }`}>
                <p className="mb-2">{importTest.message || importTest.error}</p>
                
                {importTest.success && importTest.data && (
                  <div className="bg-green-100 p-3 rounded border">
                    <h4 className="font-medium mb-2">Import Details:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• StreamingAvatar: {importTest.data.StreamingAvatar}</li>
                      <li>• StreamingEvents: {importTest.data.StreamingEvents}</li>
                      <li>• AvatarQuality: {importTest.data.AvatarQuality}</li>
                      <li>• Has Default Export: {importTest.data.hasDefaultExport ? "Yes" : "No"}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Testing imports...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
