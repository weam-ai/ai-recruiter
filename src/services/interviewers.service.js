import { getDb } from "@/lib/mongodb.js";
import { COLLECTIONS } from "@/lib/collection-constants";

const getAllInterviewers = async (companyId) => {
  try {
    const db = await getDb();
    const query = companyId ? { companyId } : {};
    const interviewers = await db.collection(COLLECTIONS.INTERVIEWER)
      .find(query)
      .sort({ created_at: -1 })
      .toArray();
    return interviewers;
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    throw error;
  }
};

const createInterviewer = async (payload) => {
  try {
    const db = await getDb();
    const newInterviewer = {
      ...payload,
      created_at: new Date(),
    };
    const result = await db.collection(COLLECTIONS.INTERVIEWER).insertOne(newInterviewer);
    return result;
  } catch (error) {
    console.error("Error creating interviewer:", error);
    throw error;
  }
};

const getInterviewerById = async (id, companyId) => {
  try {
    const db = await getDb();
    const { ObjectId } = require('mongodb');
    
    // Build query with companyId filter
    const buildQuery = (idField, idValue) => {
      const query = { [idField]: idValue };
      if (companyId) {
        query.companyId = companyId;
      }
      return query;
    };
    
    // Try to find by _id first (MongoDB ObjectId), then by id field
    let interviewer = null;
    
    // If id looks like a MongoDB ObjectId string, try to convert it
    if (id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      try {
        interviewer = await db.collection(COLLECTIONS.INTERVIEWER).findOne(buildQuery("_id", new ObjectId(id)));
      } catch (objectIdError) {
        // console.log("Failed to convert to ObjectId, trying as string:", objectIdError.message);
        interviewer = await db.collection(COLLECTIONS.INTERVIEWER).findOne(buildQuery("_id", id));
      }
    } else {
      interviewer = await db.collection(COLLECTIONS.INTERVIEWER).findOne(buildQuery("_id", id));
    }
    
    if (!interviewer) {
      interviewer = await db.collection(COLLECTIONS.INTERVIEWER).findOne(buildQuery("id", id));
    }
    
    return interviewer;
  } catch (error) {
    console.error("Error fetching interviewer:", error);
    throw error;
  }
};

const updateInterviewer = async (id, updates) => {
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.INTERVIEWER).updateOne(
      { id: id },
      { $set: updates }
    );
    return result;
  } catch (error) {
    console.error("Error updating interviewer:", error);
    throw error;
  }
};

const deleteInterviewer = async (id) => {
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTIONS.INTERVIEWER).deleteOne({ id: id });
    return result;
  } catch (error) {
    console.error("Error deleting interviewer:", error);
    throw error;
  }
};

export const InterviewerService = {
  getAllInterviewers,
  createInterviewer,
  getInterviewerById,
  updateInterviewer,
  deleteInterviewer,
};
