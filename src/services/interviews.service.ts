import { getDb } from "@/lib/mongodb";
import { Interview } from "@/types/database.types";

const getAllInterviews = async (companyId: string) => {
  try {
    const db = await getDb();
    const interviews = await db.collection("interview")
      .find({ companyId })
      .sort({ created_at: -1 })
      .toArray();
    
    // Add response count for each interview
    const interviewsWithResponseCount = await Promise.all(
      interviews.map(async (interview) => {
        try {
          const responseCount = await db.collection("response")
            .countDocuments({ interview_id: interview.id || interview._id });
          
          return {
            ...interview,
            response_count: responseCount
          };
        } catch (error) {
          console.log(`Error counting responses for interview ${interview.id}:`, error);
          return {
            ...interview,
            response_count: 0
          };
        }
      })
    );
    
    return interviewsWithResponseCount;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getInterviewById = async (id: string, companyId?: string) => {
  try {
    const db = await getDb();
    
    // Build query with companyId filter
    const buildQuery = (field: string, value: string) => {
      const query: any = { [field]: value };
      if (companyId) {
        query.companyId = companyId;
      }
      return query;
    };
    
    // First try to find by id, then by readable_slug
    let interview = await db.collection("interview").findOne(buildQuery("id", id));
    
    if (!interview) {
      // If not found by id, try by readable_slug
      interview = await db.collection("interview").findOne(buildQuery("readable_slug", id));
    }
    
    if (interview) {
      // Ensure is_active is set to true by default for all interviews
      if (interview.is_active === undefined) {
        interview.is_active = true;
      }
      
      // Fix for test interviews with invalid interviewer_id
      if (id === "weam-ricky" || interview.readable_slug === "weam-ricky") {
        interview.interviewer_id = 1; // Use Lisa's ID
        interview.is_active = true; // Ensure it's active
      }
      
      // Add response count
      try {
        const responseCount = await db.collection("response")
          .countDocuments({ interview_id: interview.id || interview._id });
        interview.response_count = responseCount;
      } catch (error) {
        console.log(`Error counting responses for interview ${interview.id}:`, error);
        interview.response_count = 0;
      }
    }
    
    return interview;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createInterview = async (payload: any) => {
  try {
    const db = await getDb();
    const newInterview: any = {
      ...payload,
      created_at: new Date(),
    };
    
    const result = await db.collection("interview").insertOne(newInterview);
    
    if (!result.acknowledged) {
      console.log("Failed to create interview");
      return null;
    }
    
    const insertedInterview = await db.collection("interview").findOne({ _id: result.insertedId });
    return insertedInterview;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateInterview = async (id: string, updates: any, companyId?: string) => {
  try {
    const db = await getDb();
    const { ObjectId } = require('mongodb');
    
    // Build query with companyId filter
    const buildQuery = (field: string, value: string) => {
      const query: any = { [field]: value };
      if (companyId) {
        query.companyId = companyId;
      }
      return query;
    };
    
    // Try to find by id first, then by readable_slug
    let result = await db.collection("interview").updateOne(
      buildQuery("id", id),
      { $set: updates }
    );
    
    if (result.modifiedCount === 0) {
      // If not found by id, try by readable_slug
      result = await db.collection("interview").updateOne(
        buildQuery("readable_slug", id),
        { $set: updates }
      );
    }
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteInterview = async (id: string, companyId?: string) => {
  try {
    const db = await getDb();
    
    // Build query with companyId filter
    const buildQuery = (field: string, value: string) => {
      const query: any = { [field]: value };
      if (companyId) {
        query.companyId = companyId;
      }
      return query;
    };
    
    // Try to find by id first, then by readable_slug
    let result = await db.collection("interview").deleteOne(buildQuery("id", id));
    
    if (result.deletedCount === 0) {
      // If not found by id, try by readable_slug
      result = await db.collection("interview").deleteOne(buildQuery("readable_slug", id));
    }
    
    return result.deletedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getInterviewsByOrganization = async (organizationId: string) => {
  try {
    const db = await getDb();
    const interviews = await db.collection("interview")
      .find({ 
        $or: [
          { companyId: organizationId },
          { organization_id: organizationId } // Fallback for old records
        ]
      })
      .sort({ created_at: -1 })
      .toArray();
    
    // Add response count for each interview
    const interviewsWithResponseCount = await Promise.all(
      interviews.map(async (interview) => {
        try {
          const responseCount = await db.collection("response")
            .countDocuments({ interview_id: interview.id || interview._id });
          
          return {
            ...interview,
            response_count: responseCount
          };
        } catch (error) {
          console.log(`Error counting responses for interview ${interview.id}:`, error);
          return {
            ...interview,
            response_count: 0
          };
        }
      })
    );
    
    return interviewsWithResponseCount;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deactivateInterviewsByOrgId = async (organizationId: string) => {
  try {
    const db = await getDb();
    const result = await db.collection("interview").updateMany(
      { 
        $or: [
          { companyId: organizationId },
          { organization_id: organizationId } // Fallback for old records
        ]
      },
      { $set: { is_active: false } }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const InterviewService = {
  getAllInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
  getInterviewsByOrganization,
  deactivateInterviewsByOrgId,
};

