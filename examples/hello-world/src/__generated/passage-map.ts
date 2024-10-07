// @ts-nocheck
import { lazy } from 'react';

export const passageMap = {
  End: lazy(() => import('../passages/end.tsx').then(module => ({default: module.End}))),
  Middle: lazy(() => import('../passages/middle.tsx').then(module => ({default: module.Middle}))),
  Start: lazy(() => import('../passages/start.tsx').then(module => ({default: module.Start}))),
  WithMarkdown: lazy(() => import('../passages/with-markdown.tsx').then(module => ({default: module.WithMarkdown}))),
} as const;

export const passageMapDuplicates = [] as const

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
