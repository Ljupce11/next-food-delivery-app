import { cache } from "react";
import { auth } from "../../auth";

export const getCurrentUser = cache(async () => (await auth())?.user);
