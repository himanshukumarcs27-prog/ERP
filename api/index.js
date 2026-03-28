import app from "../backend/server.js";

export default function handler(req, res) {
console.log("sucessfully running backend");
  return app(req, res);
}