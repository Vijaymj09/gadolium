import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const hono = new Hono();

serve(hono, (info) => {
  console.log(`Server is running @ http://localhost:${info.port}`);
});