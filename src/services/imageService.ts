import { Request } from "express";

export class ImageService {
  static async uploadEventImage(req: Request): Promise<string | null> {
    if (!req.file) return null;
    return `/uploads/events/${req.file.filename}`;
  }
}