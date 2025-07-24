import { generateJWT } from "./generate-jwt";
import { hashPassword } from "./hash-password";
import { validateJWT } from "./validate-jwt";

// General module wrapper
export default { generateJWT, hashPassword, validateJWT };
