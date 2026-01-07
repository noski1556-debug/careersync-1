import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "../_generated/dataModel";

export const password = Password<DataModel>({
  id: "password",
  // Optional: Configure password requirements
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
    };
  },
});
