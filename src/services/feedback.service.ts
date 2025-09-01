import { getDb } from "@/lib/mongodb";
import { FeedbackData } from "@/types/response";
import { Feedback } from "@/types/database.types";

const submitFeedback = async (feedbackData: FeedbackData) => {
  try {
    const db = await getDb();
    const newFeedback: any = {
      ...feedbackData,
      created_at: new Date(),
    };
    
    const result = await db.collection<Feedback>("feedback").insertOne(newFeedback);
    
    if (!result.acknowledged) {
      throw new Error("Failed to insert feedback");
    }
    
    const insertedFeedback = await db.collection<Feedback>("feedback").findOne({ _id: result.insertedId });
    return insertedFeedback ? [insertedFeedback] : [];
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

export const FeedbackService = {
  submitFeedback,
};
