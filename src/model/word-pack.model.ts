export interface WordPackFile {
  name: string;
  words: string[];
  fileExtention: string;
}

export interface WordPackCollection {
  wordPackFiles: WordPackFile[];
  timeStamp: number;
}
