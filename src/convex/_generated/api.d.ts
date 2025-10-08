/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aiAnalysis from "../aiAnalysis.js";
import type * as aiMentor from "../aiMentor.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as autumn from "../autumn.js";
import type * as careersync from "../careersync.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as referrals from "../referrals.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aiAnalysis: typeof aiAnalysis;
  aiMentor: typeof aiMentor;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  autumn: typeof autumn;
  careersync: typeof careersync;
  files: typeof files;
  http: typeof http;
  referrals: typeof referrals;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
