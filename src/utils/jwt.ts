// src/utils/jwt.ts
import jwt, { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";
import Audience from "../constants/audience";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { UserDocument } from "../models/user.model";
import { SessionDocument } from "../models/session.model";

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};

export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

/**
 * NOTE:
 * - signDefaults uses `audience` as string[] which matches SignOptions.
 * - verifyDefaults uses `audience` as string which matches VerifyOptions.
 *   This avoids the TypeScript overload mismatch.
 */
const signDefaults: SignOptions = {
  audience: [Audience.User],
};

const verifyDefaults: VerifyOptions = {
  audience: Audience.User,
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

/**
 * Generic sign function (works for both access & refresh payload shapes).
 */
export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
): string => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload as object, secret, {
    ...signDefaults,
    ...signOpts,
  });
};

/** Convenience helpers */
export const signAccessToken = (payload: AccessTokenPayload) =>
  signToken(payload, accessTokenSignOptions);

export const signRefreshToken = (payload: RefreshTokenPayload) =>
  signToken(payload, refreshTokenSignOptions);

/**
 * verifyToken:
 * - Generic return payload type TPayload (defaults to AccessTokenPayload)
 * - Uses verifyDefaults (audience is a string) to satisfy VerifyOptions typing
 * - Narrows decoded result at runtime and then casts to TPayload
 */
export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret?: string }
): { payload?: TPayload & JwtPayload; error?: string } => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const decoded = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...verifyOpts,
    });

    // runtime guard — reject non-object results (jwt.verify can return string | object)
    if (typeof decoded !== "object" || decoded === null) {
      throw new Error("Invalid token payload");
    }

    // At this point we know decoded is an object; cast to generic payload
    const payload = decoded as TPayload & JwtPayload;
    return { payload };
  } catch (error: any) {
    return { error: error?.message ?? String(error) };
  }
};
