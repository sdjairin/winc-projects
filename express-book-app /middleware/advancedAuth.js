import { auth } from "express-oauth2-jwt-bearer";

const checkJwt = auth({
  audience: "https://book-store-api", // e.g. https://book-store-api
  issuerBaseURL: "https://dev-w734euo6g2jm6bde.eu.auth0.com/",
});

export default checkJwt;
