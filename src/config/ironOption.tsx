const ironOption = {
    cookieName: process.env.NEXT_PUBLIC_COOKIE_NAME,
    password: process.env.NEXT_PUBLIC_COOKIE_PASSWORD,
    cookieOptions: {
        httpOnly: true,
        secure: false,
    },
};

export default ironOption;
