module.exports = {
    SERVER: {
        NODE_ENV: process.env.NODE_ENV
    },
    DATABASE: {
        DB_CONNECTION: process.env.DB_CONNECTION || "mongodb+srv",
        DB_HOST: process.env.DB_HOST,
        DB_DATABASE: process.env.DB_DATABASE,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_PORT: process.env.DB_PORT
    },
    RETELL: {
        API_KEY: process.env.RETELL_API_KEY
    },
    OPENAI: {
        API_KEY: process.env.OPENAI_API_KEY
    },
    APP: {
        LIVE_URL: process.env.NEXT_PUBLIC_LIVE_URL,
        API_BASE_PATH: process.env.NEXT_PUBLIC_API_BASE_PATH
    },
    SESSION: {
        COOKIE_NAME: process.env.NEXT_PUBLIC_COOKIE_NAME,
        COOKIE_PASSWORD: process.env.NEXT_PUBLIC_COOKIE_PASSWORD
    }
};
