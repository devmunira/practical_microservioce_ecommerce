import { authentication } from "./authentication";
import { isAdmin } from "./isAdmin";
const middlewares = { authentication, isAdmin };
export { default as methodNotAllowed } from "./methodNotAllowed";
export { default as errorHandler } from "./errorHandler";
export default middlewares;
