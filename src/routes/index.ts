import { Hono } from "hono";
import { serve } from "@hono/node-server";
import {
  LogInWtihUsernameAndPasswordError,
  SignUpWithUsernameAndPasswordError,
} from "../controllers/+type";
import {
  signUpWithUsernameAndPassword,
  logInWithUsernameAndPassword,
} from "../controllers";

export const hono = new Hono();

hono.post("/authentication/sign-up", async (context) => {
  const { username, password } = await context.req.json();

  try {
    const result = await signUpWithUsernameAndPassword({ username, password });

    return context.json({ data: result }, 201);
  } catch (e) {
    if (e === SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json({ message: "Username already exists" }, 409);
    }

    return context.json({ message: "Unknown error" }, 500);
  }
});

hono.post("/authentication/log-in", async (context) => {
  try {
    const { username, password } = await context.req.json();

    const result = await logInWithUsernameAndPassword({ username, password });

    return context.json({ data: result }, 201);
  } catch (e) {
    if (e === LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD) {
      return context.json({ message: "Incorrect username or password" }, 401);
    }

    return context.json({ message: "Unknown error" }, 500);
  }
});

hono.get("/health", (context) => {
  return context.json({ message: "All Ok" }, 200);
});

// Start the server
serve(hono, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
