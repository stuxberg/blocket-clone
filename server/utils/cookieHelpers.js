export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true, // Not accessible via JavaScript
    secure: process.env.NODE_ENV === "production", // Only HTTPS in production
    sameSite: "lax", // Allows cookies in safe cross-origin requests (needed for localhost dev)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
