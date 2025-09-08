/**
 * Utility function to generate MongoDB URI from environment variables
 * This function handles both direct MONGODB_URI and individual component configuration
 * Only executes when called, not at module load time
 */
export function getMongoUri(): string | null {
    // Only execute in server-side environment
    if (typeof window !== 'undefined') {
        return null;
    }
    
    // If MONGODB_URI is provided, use it directly
    if (process.env.MONOGODB_URI) {
        return process.env.MONOGODB_URI;
    }
    
    // Otherwise, construct URI from individual components
    const connection = process.env.DB_CONNECTION || "mongodb+srv";
    const host = process.env.DB_HOST;
    const database = process.env.DB_DATABASE;
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const port = process.env.DB_PORT;
    
    // Check if required components are available
    if (!host || !database || !username || !password) {
        return null; // Return null if required components are missing
    }
    
    // Construct the URI
    let uri = `${connection}://${username}:${password}@${host}`;
    
    // Add port if provided
    if (port) {
        uri += `:${port}`;
    }
    
    // Add database
    uri += `/${database}`;
    
    // Add query parameters for MongoDB Atlas
    if (connection === "mongodb+srv") {
        uri += "?retryWrites=true&w=majority";
    }
    
    return uri;
}
