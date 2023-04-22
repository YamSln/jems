import { WordType } from '../../../../model/word.type';

export interface Word {
  index: number;
  content: string;
  selected: boolean;
  type: WordType;
}
