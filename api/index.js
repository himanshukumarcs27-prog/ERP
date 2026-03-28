import app from "../backend/server.js";
import serverless from "serverless-http";

const handler = serverless(app);

export default handler;