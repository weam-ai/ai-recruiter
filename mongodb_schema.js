// MongoDB Schema for FoloUp Application
// This file contains the MongoDB collection schemas and indexes

// Organization Collection
db.createCollection("organization", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "created_at"],
      properties: {
        id: { bsonType: "string" },
        created_at: { bsonType: "date" },
        name: { bsonType: ["string", "null"] },
        image_url: { bsonType: ["string", "null"] },
        allowed_responses_count: { bsonType: ["int", "null"] },
        plan: { 
          enum: ["free", "pro", "free_trial_over", null],
          bsonType: ["string", "null"]
        }
      }
    }
  }
});

// User Collection
db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "created_at"],
      properties: {
        id: { bsonType: "string" },
        created_at: { bsonType: "date" },
        email: { bsonType: ["string", "null"] },
        organization_id: { bsonType: ["string", "null"] }
      }
    }
  }
});

// Interviewer Collection
db.createCollection("interviewer", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "created_at", "agent_id", "name", "description", "image", "empathy", "exploration", "rapport", "speed"],
      properties: {
        id: { bsonType: "int" },
        created_at: { bsonType: "date" },
        agent_id: { bsonType: "string" },
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        image: { bsonType: "string" },
        audio: { bsonType: ["string", "null"] },
        empathy: { bsonType: "int" },
        exploration: { bsonType: "int" },
        rapport: { bsonType: "int" },
        speed: { bsonType: "int" }
      }
    }
  }
});

// Interview Collection
db.createCollection("interview", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "created_at"],
      properties: {
        id: { bsonType: "string" },
        created_at: { bsonType: "date" },
        name: { bsonType: ["string", "null"] },
        description: { bsonType: ["string", "null"] },
        objective: { bsonType: ["string", "null"] },
        organization_id: { bsonType: ["string", "null"] },
        user_id: { bsonType: ["string", "null"] },
        interviewer_id: { bsonType: ["int", "null"] },
        is_active: { bsonType: "bool" },
        is_anonymous: { bsonType: "bool" },
        is_archived: { bsonType: "bool" },
        logo_url: { bsonType: ["string", "null"] },
        theme_color: { bsonType: ["string", "null"] },
        url: { bsonType: ["string", "null"] },
        readable_slug: { bsonType: ["string", "null"] },
        questions: { bsonType: ["object", "array", "null"] },
        quotes: { bsonType: ["array", "null"] },
        insights: { bsonType: ["array", "null"] },
        respondents: { bsonType: ["array", "null"] },
        question_count: { bsonType: ["int", "null"] },
        response_count: { bsonType: ["int", "null"] },
        time_duration: { bsonType: ["string", "null"] }
      }
    }
  }
});

// Response Collection
db.createCollection("response", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "created_at"],
      properties: {
        id: { bsonType: "int" },
        created_at: { bsonType: "date" },
        interview_id: { bsonType: ["string", "null"] },
        name: { bsonType: ["string", "null"] },
        email: { bsonType: ["string", "null"] },
        call_id: { bsonType: ["string", "null"] },
        candidate_status: { bsonType: ["string", "null"] },
        duration: { bsonType: ["int", "null"] },
        details: { bsonType: ["object", "null"] },
        analytics: { bsonType: ["object", "null"] },
        is_analysed: { bsonType: "bool" },
        is_ended: { bsonType: "bool" },
        is_viewed: { bsonType: "bool" },
        tab_switch_count: { bsonType: ["int", "null"] }
      }
    }
  }
});

// Feedback Collection
db.createCollection("feedback", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "created_at"],
      properties: {
        id: { bsonType: "int" },
        created_at: { bsonType: "date" },
        interview_id: { bsonType: ["string", "null"] },
        email: { bsonType: ["string", "null"] },
        feedback: { bsonType: ["string", "null"] },
        satisfaction: { bsonType: ["int", "null"] }
      }
    }
  }
});

// Create indexes for better performance
db.organization.createIndex({ "id": 1 }, { unique: true });
db.user.createIndex({ "id": 1 }, { unique: true });
db.interviewer.createIndex({ "id": 1 }, { unique: true });
db.interview.createIndex({ "id": 1 }, { unique: true });
db.interview.createIndex({ "readable_slug": 1 });
db.interview.createIndex({ "organization_id": 1 });
db.interview.createIndex({ "user_id": 1 });
db.response.createIndex({ "id": 1 }, { unique: true });
db.response.createIndex({ "call_id": 1 });
db.response.createIndex({ "interview_id": 1 });
db.feedback.createIndex({ "id": 1 }, { unique: true });
db.feedback.createIndex({ "interview_id": 1 });

print("MongoDB collections and indexes created successfully!");
