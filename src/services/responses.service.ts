import { getDb } from "@/lib/mongodb";
import { Response } from "@/types/database.types";
import { ObjectId } from "mongodb";

const createResponse = async (payload: any) => {
  try {
    const db = await getDb();
    const newResponse: any = {
      ...payload,
      created_at: new Date(),
    };
    
    const result = await db.collection("response").insertOne(newResponse);
    
    if (!result.acknowledged) {
      console.log("Failed to create response");
      return null;
    }
    
    return result.insertedId.toString();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const saveResponse = async (payload: any, call_id: string) => {
  try {
    const db = await getDb();
    const result = await db.collection("response").updateOne(
      { call_id },
      { $set: { ...payload } }
    );
    
    if (result.matchedCount === 0) {
      console.log("Response not found for call_id:", call_id);
      return null;
    }
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getResponseByCallId = async (call_id: string) => {
  try {
    const db = await getDb();
    const response = await db.collection("response").findOne({ call_id });
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllResponses = async (interviewId: string) => {
  try {
    const db = await getDb();
    const responses = await db.collection("response")
      .find({ interview_id: interviewId })
      .sort({ created_at: -1 })
      .toArray();
    
    return responses;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const updateResponse = async (id: string, updates: any) => {
  try {
    const db = await getDb();
    const result = await db.collection("response").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getResponseCountByOrganizationId = async (organizationId: string): Promise<number> => {
  try {
    const db = await getDb();
    // First get all interviews for the organization
    const interviews = await db.collection("interview").find({ organization_id: organizationId }).toArray();
    const interviewIds = interviews.map((interview: any) => interview.id);
    
    // Then count responses for those interviews
    const count = await db.collection("response").countDocuments({ 
      interview_id: { $in: interviewIds } 
    });
    
    return count;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const getAllEmailAddressesForInterview = async (interviewId: string) => {
  try {
    const db = await getDb();
    const responses = await db.collection("response")
      .find({ interview_id: interviewId })
      .project({ email: 1 })
      .toArray();
    
    return responses.map((response: any) => response.email).filter(Boolean);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const ResponseService = {
  createResponse,
  saveResponse,
  getResponseByCallId,
  getAllResponses,
  updateResponse,
  getResponseCountByOrganizationId,
  getAllEmails: getAllEmailAddressesForInterview,
};
