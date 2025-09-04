module.exports = {
    SERVER: {
        NODE_ENV: process.env.NODE_ENV
    },
    DATABASE: {
        MONGODB_URI: process.env.MONGODB_URI
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
