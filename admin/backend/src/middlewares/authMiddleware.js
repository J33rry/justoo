// JWT authentication middleware
import { verifyToken, extractTokenFromHeader } from "../utils/auth.js";
import { unauthorizedResponse } from "../utils/response.js";
import { testUserService } from "../config/testUsers.js";

const authMiddleware = (req, res, next) => {
    try {
        // Try to get token from cookie first, then from Authorization header
        let token = req.cookies?.auth_token;

        if (!token) {
            token = extractTokenFromHeader(req.headers.authorization);
        }

        if (!token) {
            return unauthorizedResponse(res, "Access token required");
        }

        const decoded = verifyToken(token);

        // If it's a test user, validate against test users
        if (decoded.isTestUser) {
            const testUser = testUserService.findById(decoded.id);
            if (!testUser || !testUser.isActive) {
                return unauthorizedResponse(
                    res,
                    "Invalid or inactive test user"
                );
            }
            req.user = { ...decoded, ...testUser };
        } else {
            // Regular database user
            req.user = decoded;
        }

        next();
    } catch (error) {
        return unauthorizedResponse(res, "Invalid or expired token");
    }
};

export default authMiddleware;
