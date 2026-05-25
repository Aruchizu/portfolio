import { describe, expect, it } from "vitest";

import {
  PHOTO_CATEGORIES,
  getPublicPhotos,
  normalizePhotoCategory,
  parsePhotoPayload,
} from "./photos";
import { samplePhotos } from "./sample-photos";

describe("photo helpers", () => {
  it("accepts the fixed v1 photography categories", () => {
    expect(PHOTO_CATEGORIES).toEqual(["Eroplano", "Tanawin", "Kotse", "Tao"]);
  });

  it("normalizes admin photo payloads", () => {
    const payload = parsePhotoPayload({
      title: "  Final approach  ",
      caption: "A320 on short final",
      category: "Eroplano",
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      cloudinaryPublicId: "portfolio/final-approach",
      width: 2400,
      height: 1600,
      isFeatured: true,
      isPublished: true,
    });

    expect(payload.title).toBe("Final approach");
    expect(payload.category).toBe("Eroplano");
    expect(payload.isFeatured).toBe(true);
    expect(payload.isPublished).toBe(true);
  });

  it("maps old English categories and tags to Tagalog labels", () => {
    expect(normalizePhotoCategory("Aviation")).toBe("Eroplano");
    expect(normalizePhotoCategory("category-landscape")).toBe("Tanawin");
    expect(normalizePhotoCategory("Cars")).toBe("Kotse");
    expect(normalizePhotoCategory("People")).toBe("Tao");
    expect(normalizePhotoCategory("unknown")).toBe("Eroplano");
  });

  it("returns only published photos with featured photos first", () => {
    const publicPhotos = getPublicPhotos([
      {
        id: "1",
        title: "Hidden draft",
        caption: "",
        category: "Kotse",
        imageUrl: "https://example.com/hidden.jpg",
        cloudinaryPublicId: "hidden",
        width: 1200,
        height: 800,
        isFeatured: true,
        isPublished: false,
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01"),
      },
      {
        id: "2",
        title: "Gate light",
        caption: "",
        category: "Tanawin",
        imageUrl: "https://example.com/gate.jpg",
        cloudinaryPublicId: "gate",
        width: 1200,
        height: 800,
        isFeatured: false,
        isPublished: true,
        createdAt: new Date("2026-01-02"),
        updatedAt: new Date("2026-01-02"),
      },
      {
        id: "3",
        title: "Red tail",
        caption: "",
        category: "Eroplano",
        imageUrl: "https://example.com/red-tail.jpg",
        cloudinaryPublicId: "red-tail",
        width: 1200,
        height: 800,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date("2026-01-03"),
        updatedAt: new Date("2026-01-03"),
      },
    ]);

    expect(publicPhotos.map((photo) => photo.title)).toEqual([
      "Red tail",
      "Gate light",
    ]);
  });

  it("does not ship placeholder photos before uploads exist", () => {
    expect(samplePhotos).toEqual([]);
    expect(getPublicPhotos(samplePhotos)).toEqual([]);
  });
});
