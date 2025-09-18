import { getDb } from "@/lib/mongodb";
import { nanoid } from "nanoid";
const config = require("@/config/config");

export interface InterviewToken {
  id: string;
  interview_id: string;
  token: string;
  created_at: Date;
  expires_at: Date;
  is_used: boolean;
  used_at?: Date;
  user?: {
    id: string;
    email: string;
  };
  companyId?: string;
}

export class InterviewTokenService {
  private static collectionName = "solution_foloup_interview_tokens";

  static async createToken(interviewId: string, user: any, companyId?: string): Promise<InterviewToken> {
    const db = await getDb();
    const collection = db.collection(this.collectionName);

    const tokenId = nanoid();
    const token = nanoid(32);
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.INTERVIEW.TOKEN_EXPIRY_DAYS);

    const tokenData: InterviewToken = {
      id: tokenId,
      interview_id: interviewId,
      token: token,
      created_at: now,
      expires_at: expiresAt,
      is_used: false,
      user: {
        id: user._id,
        email: user.email || "unknown@example.com"
      },
      companyId: companyId
    };

    await collection.insertOne(tokenData);
    return tokenData;
  }

  static async getTokenByValue(token: string): Promise<InterviewToken | null> {
    const db = await getDb();
    const collection = db.collection(this.collectionName);

    const tokenData = await collection.findOne({ token });
    return tokenData as InterviewToken | null;
  }

  static async getTokensByInterviewId(interviewId: string): Promise<InterviewToken[]> {
    const db = await getDb();
    const collection = db.collection(this.collectionName);

    const tokens = await collection.find({ interview_id: interviewId }).toArray();
    return tokens as InterviewToken[];
  }

  static async markTokenAsUsed(token: string): Promise<boolean> {
    const db = await getDb();
    const collection = db.collection(this.collectionName);

    const result = await collection.updateOne(
      { token },
      { 
        $set: { 
          is_used: true, 
          used_at: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  static async validateToken(token: string): Promise<{ valid: boolean; tokenData?: InterviewToken; error?: string }> {
    const tokenData = await this.getTokenByValue(token);
    
    if (!tokenData) {
      return { valid: false, error: "Token not found" };
    }

    if (tokenData.is_used) {
      return { valid: false, error: "Token has already been used" };
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      return { valid: false, error: "Token has expired" };
    }

    return { valid: true, tokenData };
  }

  static async cleanupExpiredTokens(): Promise<number> {
    const db = await getDb();
    const collection = db.collection(this.collectionName);

    const result = await collection.deleteMany({
      expires_at: { $lt: new Date() }
    });

    return result.deletedCount;
  }

  static async getActiveTokensCount(interviewId: string): Promise<number> {
    const db = await getDb();
    const collection = db.collection(this.collectionName);

    const count = await collection.countDocuments({
      interview_id: interviewId,
      is_used: false,
      expires_at: { $gt: new Date() }
    });

    return count;
  }
}
