/*
 * <license header>
 */

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */

import { Core } from "@adobe/aio-sdk";
import { errorResponse } from "../utils.js";
import markdownItToHtml from "./MarkdownIt.js";

const gitProxy =
  "https://raw.githubusercontent.com/sagarsane/edsdemo-md/refs/heads/main/content";

async function fetchWithIndexFallback(path) {
  const response = await fetch(`${gitProxy}${path}.md`);
  if (response.ok) {
    return response;
  } else {
    return await fetch(`${gitProxy}${path}/index.md`);
  }
}

// main function that will be executed by Adobe I/O Runtime
export const main = async function main(params) {
  // create a Logger
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });
  const { __ow_path } = params;
  // eslint-disable-next-line camelcase
  const path = __ow_path || "/";
  try {
    const response = await fetchWithIndexFallback(path);
    if (response.ok) {
      const mdString = await response.text();
      return {
        statusCode: 200,
        body: markdownItToHtml(mdString),
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=60",
        },
      };
    } else {
      return errorResponse(404, "Not Found", logger);
    }
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, "server error", logger);
  }
};
