import { ObjectId, type Document, type WithId } from "mongodb";

import { hasMongoConfig, getPortfolioDb } from "./mongodb";
import type { PhotoPayload, PhotoRecord } from "./photos";
import { getPublicPhotos, parsePhotoPayload } from "./photos";

const COLLECTION = "photos";

function toPhotoRecord(document: WithId<Document>): PhotoRecord {
  return {
    id: document._id.toString(),
    title: document.title,
    caption: document.caption ?? "",
    category: document.category,
    imageUrl: document.imageUrl,
    cloudinaryPublicId: document.cloudinaryPublicId,
    width: document.width,
    height: document.height,
    camera: document.camera,
    location: document.location,
    isFeatured: Boolean(document.isFeatured),
    isPublished: Boolean(document.isPublished),
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt),
  };
}

async function photosCollection() {
  const db = await getPortfolioDb();
  return db.collection(COLLECTION);
}

export async function getAllPhotos(): Promise<PhotoRecord[]> {
  if (!hasMongoConfig()) {
    return [];
  }

  const collection = await photosCollection();
  const documents = await collection.find({}).sort({ createdAt: -1 }).toArray();

  return documents.map(toPhotoRecord);
}

export async function getPublishedPhotos(): Promise<PhotoRecord[]> {
  if (!hasMongoConfig()) {
    return [];
  }

  const collection = await photosCollection();
  const documents = await collection
    .find({ isPublished: true })
    .sort({ isFeatured: -1, createdAt: -1 })
    .toArray();

  return getPublicPhotos(documents.map(toPhotoRecord));
}

export async function createPhoto(payload: PhotoPayload): Promise<PhotoRecord> {
  const parsed = parsePhotoPayload(payload);
  const now = new Date();
  const collection = await photosCollection();
  const result = await collection.insertOne({
    ...parsed,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: result.insertedId.toString(),
    ...parsed,
    createdAt: now,
    updatedAt: now,
  };
}

export async function deletePhoto(id: string): Promise<PhotoRecord | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await photosCollection();
  const result = await collection.findOneAndDelete({ _id: new ObjectId(id) });

  return result ? toPhotoRecord(result) : null;
}
