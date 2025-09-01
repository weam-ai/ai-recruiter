import { getDb } from "@/lib/mongodb.js";

const getAllInterviewers = async (clientId) => {
  try {
    const db = await getDb();
    const interviewers = await db.collection("interviewer")
      .find({})
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
    const result = await db.collection("interviewer").insertOne(newInterviewer);
    return result;
  } catch (error) {
    console.error("Error creating interviewer:", error);
    throw error;
  }
};

const getInterviewerById = async (id) => {
  try {
    const db = await getDb();
    const interviewer = await db.collection("interviewer").findOne({ id: id });
    return interviewer;
  } catch (error) {
    console.error("Error fetching interviewer:", error);
    throw error;
  }
};

const updateInterviewer = async (id, updates) => {
  try {
    const db = await getDb();
    const result = await db.collection("interviewer").updateOne(
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
    const result = await db.collection("interviewer").deleteOne({ id: id });
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
