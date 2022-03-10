import { WordType } from "./word.type";

export interface Word {
  index: number;
  content: string;
  selected: boolean;
  type: WordType;
}
