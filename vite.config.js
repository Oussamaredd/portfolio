import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleGitHubContributionsRequest } from "./server/githubContributionsApi.js";

function githubContributionsDevMiddleware() {
  return {
    name: "github-contributions-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/github-contributions", async (req, res, next) => {
        try {
          const headers = new Headers();

          for (const [key, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) {
              value.forEach((entry) => headers.append(key, entry));
              continue;
            }

            if (typeof value === "string") {
              headers.set(key, value);
            }
          }

          const request = new Request(new URL(req.url ?? "", "http://localhost/api/github-contributions").toString(), {
            method: req.method ?? "GET",
            headers,
          });
          const response = await handleGitHubContributionsRequest(request, {
            token: process.env.GITHUB_TOKEN,
          });

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          res.end(await response.text());
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (env.GITHUB_TOKEN) {
    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
  }

  return {
    plugins: [react(), githubContributionsDevMiddleware()],
  };
});
