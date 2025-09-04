// Common function to generate MongoDB URI
function getMongoUri() {
    // If MONGODB_URI is provided, use it directly
    if (process.env.MONGODB_URI) {
        return process.env.MONGODB_URI;
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

module.exports = {
    SERVER: {
        NODE_ENV: process.env.NODE_ENV
    },
    DATABASE: {
        MONGODB_URI: getMongoUri()
    },
    RETELL: {
        API_KEY: process.env.RETELL_API_KEY
    },
    OPENAI: {
        API_KEY: process.env.OPENAI_API_KEY
    },
    APP: {
        LIVE_URL: process.env.NEXT_PUBLIC_LIVE_URL
    },
    SESSION: {
        COOKIE_NAME: process.env.NEXT_PUBLIC_COOKIE_NAME,
        COOKIE_PASSWORD: process.env.NEXT_PUBLIC_COOKIE_PASSWORD
    }
};
