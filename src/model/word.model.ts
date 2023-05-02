import { WordType } from "./word.type";

export interface Word {
  id: number;
  index: number;
  content: string;
  selected: boolean;
  type: WordType;
}
