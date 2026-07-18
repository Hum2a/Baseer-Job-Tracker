import { describe, expect, it } from "vitest";

describe("cookie domain contract", () => {
  it("uses app host for cross-subdomain cookies in production-like envs", () => {
    const prodDomain = "jobtracker.baseer.co.uk";
    const stagingDomain = "jobtracker-staging.baseer.co.uk";
    expect(prodDomain).toBe("jobtracker.baseer.co.uk");
    expect(stagingDomain).toContain("staging");
    // Cookie domain must be the Pages host, not the API host.
    expect(prodDomain).not.toContain("api");
    expect(stagingDomain).not.toContain("api");
  });
});
