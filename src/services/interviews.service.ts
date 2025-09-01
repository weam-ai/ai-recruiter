import { getDb } from "@/lib/mongodb";
import { Interview } from "@/types/database.types";

const getAllInterviews = async (userId: string, organizationId: string) => {
  try {
    const db = await getDb();
    const interviews = await db.collection("interview")
      .find({ user_id: userId, organization_id: organizationId })
      .sort({ created_at: -1 })
      .toArray();
    
    return interviews;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getInterviewById = async (id: string) => {
  try {
    const db = await getDb();
    const interview = await db.collection("interview").findOne({ id });
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

const updateInterview = async (id: string, updates: any) => {
  try {
    const db = await getDb();
    const result = await db.collection("interview").updateOne(
      { id },
      { $set: updates }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteInterview = async (id: string) => {
  try {
    const db = await getDb();
    const result = await db.collection("interview").deleteOne({ id });
    
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
      .find({ organization_id: organizationId })
      .sort({ created_at: -1 })
      .toArray();
    
    return interviews;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const deactivateInterviewsByOrgId = async (organizationId: string) => {
  try {
    const db = await getDb();
    const result = await db.collection("interview").updateMany(
      { organization_id: organizationId },
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

