import { describe, expect, it } from "vitest";

import {
  ABOUT_SKILLS,
  CONTACT_EMAIL,
  CV_DOWNLOAD_PATH,
  INSTAGRAM_EMBED_HTML,
  INSTAGRAM_PHONE_FRAME_PATH,
  INSTAGRAM_PROFILE_URL,
  INSTAGRAM_USERNAME,
  PROFILE_HIGHLIGHTS,
  PROFILE_SUMMARY,
} from "./profile";

describe("profile content", () => {
  it("uses the CV email for inquiries", () => {
    expect(CONTACT_EMAIL).toBe("business.alfonsocnd@gmail.com");
  });

  it("exposes a public CV download path", () => {
    expect(CV_DOWNLOAD_PATH).toBe("/Alfonso_Raphael_Candia_CV.pdf");
  });

  it("exposes Instagram profile details for the phone mockup", () => {
    expect(INSTAGRAM_USERNAME).toBe("don.fnso");
    expect(INSTAGRAM_PROFILE_URL).toBe("https://www.instagram.com/don.fnso/");
    expect(INSTAGRAM_EMBED_HTML).toBe("");
    expect(INSTAGRAM_PHONE_FRAME_PATH).toBe(
      "/IPhone_17_Pro_Max_Vector.svg",
    );
  });

  it("keeps the about copy focused on photography and other creative skills", () => {
    expect(PROFILE_SUMMARY).toContain("photography");
    expect(PROFILE_SUMMARY).toContain("design");
    expect(PROFILE_SUMMARY).toContain("social media");
    expect(ABOUT_SKILLS).toEqual([
      "Photography",
      "Graphic design",
      "Social media management",
      "Figma layouts",
      "Illustration",
      "Lightroom editing",
      "Content organization",
    ]);
    expect(PROFILE_HIGHLIGHTS).toContain("BS Information Technology student");
  });
});
