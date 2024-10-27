export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Variables {}

  type PassageName = 'Passage1' | 'Passage2';
  type Passage = FunctionComponent<unknown>;
  type PassageMap = Record<PassageName, Passage>;
}
