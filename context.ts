import { verify } from "jsonwebtoken";

export default ({ req }) => {
  const noUser = { user: false };
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return noUser;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return noUser;
  }
  let decodedToken;
  try {
    decodedToken = verify(token, "secretKey");
  } catch (err) {
    return noUser;
  }
  if (!decodedToken) {
    return noUser;
  }
  return {
    user: decodedToken.userId,
  };
};
