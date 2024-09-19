import { FunctionComponent } from 'react';

// [Token] Imports

type Passage = FunctionComponent<unknown>;
type PassageMap = Record<string, Passage>;

export const passageMap = {
  // [Token] PassageMap Lines
} as const satisfies PassageMap;

// [Token] Passage Map Errors

export function getPassage(name: string): Passage | null {
  if (name in passageMap) {
    return passageMap[name as keyof typeof passageMap];
  }
  return null;
}

export function getPassageName(passage: Passage): string | null {
  return (
    (Object.keys(passageMap) as Array<keyof typeof passageMap>).find(
      (passageName) => passageMap[passageName] === passage,
    ) ?? null
  );
}
