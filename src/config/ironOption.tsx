const config = require('./config');

const ironOption = {
    cookieName: config.SESSION.COOKIE_NAME,
    password: config.SESSION.COOKIE_PASSWORD,
    cookieOptions: {
        httpOnly: true,
        secure: false,
    },
};

export default ironOption;
