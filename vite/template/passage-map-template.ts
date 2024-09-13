import { FunctionComponent } from 'react';

// [Token] Imports here

type Passage = FunctionComponent<unknown>;

type PassageRecord = { passage: Passage; fileHash: string; exportKey: string };
const passageList: PassageRecord[] = [];

function addComponents(hash: string, components: Record<string, unknown>) {
  Object.entries(components).forEach(([name, component]) => {
    if (typeof component !== 'function') return;
    passageList.push({
      passage: component as Passage,
      exportKey: name,
      fileHash: hash,
    });
  });
}

// [Token] addComponentsHere

function getName({ passage, exportKey }: PassageRecord) {
  return passage.displayName || passage.name || exportKey;
}

type PassageMap = Record<string, Passage>;
export const passageMap: PassageMap = Object.fromEntries(
  passageList.reduce((map, record) => {
    const { passage, fileHash, exportKey } = record;
    const name = getName(record);

    // If the passage has a name, and that name is unique; save it to the map by name.
    if (name && !passageList.some((item) => item !== record && name === getName(item))) {
      return map.set(name, passage);
    }

    // If the passage does not have a name, or the name is not unique; store it by filehash+exportKey
    return map.set(`${fileHash}>${exportKey}`, passage);
  }, new Map<string, Passage>()),
);

export function getPassage(name: string): Passage | undefined {
  return passageMap[name];
}

export function getPassageName(passage: Passage): string | undefined {
  return Object.keys(passageMap).find((item) => passageMap[item] === passage);
}
