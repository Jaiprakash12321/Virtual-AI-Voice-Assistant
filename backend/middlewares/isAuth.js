import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    try {
        // 1. Get the token from cookies
        const token = req.cookies.token;

        // 2. Check if the token exists
        if (!token) {
            // Changed status to 401 Unauthorized for consistency
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // 3. Verify the token
        // Note: jwt.verify is synchronous, so 'await' is not needed unless you use a callback.
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user data to the request object for later use
        req.user = decodedPayload; // Attaching the whole payload is often more useful

        next(); // Token is valid, proceed to the next middleware/controller

    } catch (error) {
        // This block will catch errors from jwt.verify (e.g., invalid signature, expired token)
        console.error("Authentication Error in isAuth middleware:", error.message);

        // Send a 401 Unauthorized status, which is the correct code for auth failures
        return res.status(401).json({ message: "Authentication failed. Please log in again." });
    }
};

export default isAuth;