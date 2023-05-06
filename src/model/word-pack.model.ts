export interface WordPack {
  name: string;
  words: string[];
  fileExtention: string;
}

export interface WordPackCollection {
  wordPacks: WordPack[];
  timeStamp: number;
}
