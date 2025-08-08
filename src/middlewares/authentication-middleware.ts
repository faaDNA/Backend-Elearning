import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/authenticated-request-type";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

interface JwtPayload {
  sub: string | number;
  name?: string;
  email?: string;
  role?: string;
}

const authenticationMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Perlu otentikasi!",
    });
  }

  // hapus awalan 'Bearer '
  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // masukkan data otentikasi user ke aliran request selanjutnya
    req.user = {
      id: typeof decoded.sub === "string" ? parseInt(decoded.sub) : decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Token invalid atau kedaluwarsa!",
    });
  }
};

export default authenticationMiddleware;
