export {};

declare global {
  interface Variables {}

  type PassageName = string;
  type Passage = FunctionComponent<unknown>;
  type PassageMap = Record<string, Passage>;
}
