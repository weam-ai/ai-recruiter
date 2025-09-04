// Hardcoded user credentials for custom authentication
export const AUTH_USERS = [
  {
    id: "user_1",
    email: "admin@foloup.com",
    password: "admin123",
    name: "Admin User",
    organization: {
      id: "org_1",
      name: "FoloUp Admin",
      imageUrl: "/FoloUp.png"
    }
  },
  {
    id: "user_2", 
    email: "demo@foloup.com",
    password: "demo123",
    name: "Demo User",
    organization: {
      id: "org_2",
      name: "Demo Organization",
      imageUrl: "/FoloUp.png"
    }
  }
];

// Session key for localStorage
export const SESSION_KEY = "foloup_auth_session";

// Default redirect URLs
export const DEFAULT_SIGN_IN_REDIRECT = "/dashboard";
export const DEFAULT_SIGN_OUT_REDIRECT = "/sign-in";
