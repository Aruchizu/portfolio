import { describe, expect, it } from "vitest";

import { getResponseErrorMessage } from "./http";

describe("http helpers", () => {
  it("reads JSON API error messages", async () => {
    const response = new Response(JSON.stringify({ error: "Upload failed." }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });

    await expect(getResponseErrorMessage(response)).resolves.toBe(
      "Upload failed.",
    );
  });

  it("falls back to plain text errors from platform limits", async () => {
    const response = new Response("Request Entity Too Large", { status: 413 });

    await expect(getResponseErrorMessage(response)).resolves.toBe(
      "Request Entity Too Large",
    );
  });
});
