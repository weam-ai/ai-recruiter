"use client";

import React, { useState } from "react";

export default function TestHeyGenSimple() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testHeyGen = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log("Testing HeyGen package...");
      
      // Test API endpoint
      const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH || '';
      const response = await fetch(`${basePath}/api/heygen/get-access-token`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const token = await response.text();
      console.log("Token received:", token.substring(0, 20) + "...");
      
      // Test importing HeyGen package
      const { StreamingAvatar, StreamingEvents } = await import("@heygen/streaming-avatar");
      console.log("HeyGen package imported successfully");
      
      // Test creating avatar instance
      const avatar = new StreamingAvatar({
        baseUrl: "https://api.heygen.com",
        token: token,
      });
      
      console.log("Avatar instance created:", avatar);
      
      setTestResult({
        success: true,
        message: "HeyGen integration test successful!",
        data: {
          tokenLength: token.length,
          avatarCreated: !!avatar,
          packageImported: true
        }
      });
      
    } catch (error) {
      console.error("Test failed:", error);
      setTestResult({
        success: false,
        error: error.message,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Simple HeyGen Test
          </h1>
          
          <div className="mb-6">
            <button
              onClick={testHeyGen}
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isLoading ? "Testing..." : "Test HeyGen Package"}
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.success 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  testResult.success ? "bg-green-500" : "bg-red-500"
                }`}></div>
                <h3 className={`font-semibold ${
                  testResult.success ? "text-green-800" : "text-red-800"
                }`}>
                  {testResult.success ? "✅ Test Passed!" : "❌ Test Failed"}
                </h3>
              </div>
              
              <div className={`text-sm ${
                testResult.success ? "text-green-700" : "text-red-700"
              }`}>
                <p className="mb-2">{testResult.message || testResult.error}</p>
                
                {testResult.success && testResult.data && (
                  <div className="bg-green-100 p-3 rounded border">
                    <h4 className="font-medium mb-2">Test Results:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Token Length: {testResult.data.tokenLength}</li>
                      <li>• Avatar Created: {testResult.data.avatarCreated ? "Yes" : "No"}</li>
                      <li>• Package Imported: {testResult.data.packageImported ? "Yes" : "No"}</li>
                    </ul>
                  </div>
                )}
                
                {!testResult.success && (
                  <div className="bg-red-100 p-3 rounded border mt-2">
                    <h4 className="font-medium mb-1">Error Details:</h4>
                    <p className="text-xs font-mono break-all mb-2">
                      {testResult.error}
                    </p>
                    {testResult.stack && (
                      <details>
                        <summary className="cursor-pointer text-xs font-medium">Stack Trace</summary>
                        <pre className="text-xs font-mono mt-2 whitespace-pre-wrap">
                          {testResult.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
