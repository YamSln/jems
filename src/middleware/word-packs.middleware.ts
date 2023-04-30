import { NextFunction, Request, Response } from "express";
import { WordPackFile } from "../model/word-pack.model";
import path from "path";
import { UploadedFile } from "express-fileupload";

const parseWordPackFiles = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.files) {
    const wordPacks = request.files.file;
    const processedWordPacks: WordPackFile[] = Array.isArray(wordPacks)
      ? wordPacks.map((wordPack) => extractWordPack(wordPack))
      : [extractWordPack(wordPacks)];
    request.body.wordPacks = processedWordPacks;
  }
  next();
};

const extractWordPack = (file: UploadedFile): WordPackFile => {
  return {
    fileExtention: path.extname(file.name),
    name: path.parse(file.name).name,
    words: parseWordPacksBuffer(file.data),
  };
};

const parseWordPacksBuffer = (fileBuffer: Buffer): string[] => {
  return fileBuffer
    .toString("utf8")
    .split(",")
    .filter((word) => !!word)
    .map((word) => word.trim());
};

export default parseWordPackFiles;
