import jwt from "jsonwebtoken";

export const getUserIdFromToken = (req: any): number | null => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    return payload.userId;
  } catch {
    return null;
  }
};
