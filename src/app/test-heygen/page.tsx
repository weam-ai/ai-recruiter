"use client";

import React, { useState } from "react";

export default function TestHeyGenPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testHeyGenAPI = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH || ''}/api/heygen/test-api`);
      console.log("API Response Status:", response.status);
      console.log("API Response URL:", response.url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        error: `Network error: ${error.message}`
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
            HeyGen API Key Test
          </h1>
          
          <div className="mb-6">
            <button
              onClick={testHeyGenAPI}
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isLoading ? "Testing API Key..." : "Test HeyGen API Key"}
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
                  {testResult.success ? "✅ API Key Working!" : "❌ API Key Error"}
                </h3>
              </div>
              
              <div className={`text-sm ${
                testResult.success ? "text-green-700" : "text-red-700"
              }`}>
                <p className="mb-2">{testResult.message || testResult.error}</p>
                
                {testResult.success && testResult.data && (
                  <div className="bg-green-100 p-3 rounded border">
                    <h4 className="font-medium mb-2">API Details:</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Token Generated: {testResult.data.hasToken ? "Yes" : "No"}</li>
                      <li>• Token Length: {testResult.data.tokenLength} characters</li>
                      <li>• API URL: {testResult.data.apiUrl}</li>
                    </ul>
                  </div>
                )}
                
                {!testResult.success && (
                  <div className="bg-red-100 p-3 rounded border mt-2">
                    <h4 className="font-medium mb-1">Error Details:</h4>
                    <p className="text-xs font-mono break-all">
                      {testResult.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Environment Variables Check:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Make sure your <code className="bg-blue-100 px-1 rounded">.env.local</code> file contains:</p>
              <div className="bg-blue-100 p-2 rounded font-mono text-xs">
                <p>HEYGEN_API_KEY=your-heygen-api-key-here</p>
                <p>NEXT_PUBLIC_HEYGEN_BASE_API_URL=https://api.heygen.com</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/test-avatar" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Test Avatar Integration →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
