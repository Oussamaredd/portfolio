import { handleGitHubContributionsRequest } from "../server/githubContributionsApi.js";

export const config = {
  runtime: "edge",
};

export default function handler(request) {
  return handleGitHubContributionsRequest(request, {
    token: process.env.GITHUB_TOKEN,
  });
}
