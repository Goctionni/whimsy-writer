import type { FunctionComponent } from 'react';

/**
 * This is a simple placeholder-types file. In actual projects/games, these types will have
 * auto-generated values that are based on the given workspace.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Variables {}

  type PassageName = 'Passage1' | 'Passage2';
  type Passage = FunctionComponent<unknown>;
  type PassageMap = Record<PassageName, Passage>;
}
