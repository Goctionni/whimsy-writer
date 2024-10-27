export function generateTypeDefs(passageNames: string[]) {
  return [
    'declare global {',
    `  type Passage = FunctionComponent<unknown>;`,
    `  type PassageName = ${passageNames.map((str) => `'${str}'`).join(' | ')};`,
    `  type PassageMap = Record<PassageName, Passage>;`,
    '}',
    'export {};',
  ].join('\n');
}
