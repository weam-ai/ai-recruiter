"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function TestAnalysisPage() {
  const [callId, setCallId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerAnalysis = async () => {
    if (!callId.trim()) {
      setError("Please enter a call ID");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/manual-analyze-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callId: callId.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to trigger analysis");
      }
    } catch (err) {
      setError("Network error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Manual Call Analysis Trigger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="callId" className="block text-sm font-medium mb-2">
              Call ID
            </label>
            <Input
              id="callId"
              value={callId}
              onChange={(e) => setCallId(e.target.value)}
              placeholder="Enter the call ID to analyze"
            />
          </div>
          
          <Button 
            onClick={triggerAnalysis} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Analyzing..." : "Trigger Analysis"}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">Analysis Result:</h3>
              <pre className="text-sm text-green-700 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Go to the interview dashboard</li>
              <li>Find Mayur Patel's response in the list</li>
              <li>Click on the response to view details</li>
              <li>Look for the call ID in the URL or response details</li>
              <li>Enter the call ID above and click "Trigger Analysis"</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
