declare global {
  type Passage = FunctionComponent<unknown>;
  type PassageName = 'End' | 'Middle' | 'Start' | 'WithMarkdown';
  type PassageMap = Record<PassageName, Passage>;
}
export {};