import { getDb } from "@/lib/mongodb";
import { Response } from "@/types/database.types";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "@/lib/collection-constants";

const createResponse = async (payload: any) => {
  try {
    const db = await getDb();
    const newResponse: any = {
      ...payload,
      created_at: new Date(),
    };
    
    const result = await db.collection(COLLECTIONS.RESPONSE).insertOne(newResponse);
    
    if (!result.acknowledged) {
      // console.log("Failed to create response");
      return null;
    }
    
    return result.insertedId.toString();
  } catch (error) {
    // console.log(error);
    return null;
  }
};

const saveResponse = async (payload: any, call_id: string) => {
  try {
    // console.log("ResponseService.saveResponse - Updating response:", {
    //   call_id,
    //   payload
    // });
    
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.RESPONSE).updateOne(
      { call_id },
      { $set: { ...payload } }
    );
    
    // console.log("Database update result:", {
    //   matchedCount: result.matchedCount,
    //   modifiedCount: result.modifiedCount,
    //   acknowledged: result.acknowledged
    // });
    
    if (result.matchedCount === 0) {
      // console.log("Response not found for call_id:", call_id);
      return null;
    }
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error("Error in saveResponse:", error);
    return null;
  }
};

const getResponseByCallId = async (call_id: string, companyId?: string) => {
  try {
    const db = await getDb();
    
    // Build query with companyId filter
    const query: any = { call_id };
    if (companyId) {
      query.companyId = companyId;
    }
    
    const response = await db.collection(COLLECTIONS.RESPONSE).findOne(query);
    return response;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

const getAllResponses = async (interviewId: string, companyId?: string) => {
  try {
    const db = await getDb();
    
    // Build query with companyId filter and exclude deleted records
    const query: any = { 
      interview_id: interviewId,
      $or: [
        { is_deleted: { $exists: false } }, // Records without is_deleted field (legacy)
        { is_deleted: { $ne: true } }       // Records where is_deleted is not true
      ]
    };
    if (companyId) {
      query.companyId = companyId;
    }
    
    const responses = await db.collection(COLLECTIONS.RESPONSE)
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
    
    return responses;
  } catch (error) {
    // console.log(error);
    return [];
  }
};

const updateResponse = async (id: string, updates: any) => {
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.RESPONSE).updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

const getResponseCountByOrganizationId = async (organizationId: string): Promise<number> => {
  try {
    const db = await getDb();
    // First get all interviews for the organization
    const interviews = await db.collection(COLLECTIONS.INTERVIEW).find({ organization_id: organizationId }).toArray();
    const interviewIds = interviews.map((interview: any) => interview.id);
    
    // Then count responses for those interviews, excluding deleted records
    const count = await db.collection(COLLECTIONS.RESPONSE).countDocuments({ 
      interview_id: { $in: interviewIds },
      $or: [
        { is_deleted: { $exists: false } }, // Records without is_deleted field (legacy)
        { is_deleted: { $ne: true } }       // Records where is_deleted is not true
      ]
    });
    
    return count;
  } catch (error) {
    // console.log(error);
    return 0;
  }
};

const getAllEmailAddressesForInterview = async (interviewId: string) => {
  try {
    const db = await getDb();
    const responses = await db.collection(COLLECTIONS.RESPONSE)
      .find({ 
        interview_id: interviewId,
        $or: [
          { is_deleted: { $exists: false } }, // Records without is_deleted field (legacy)
          { is_deleted: { $ne: true } }       // Records where is_deleted is not true
        ]
      })
      .project({ email: 1 })
      .toArray();
    
    return responses.map((response: any) => response.email).filter(Boolean);
  } catch (error) {
    // console.log(error);
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
