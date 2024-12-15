import { NumberedVersion, Version } from './types';

function compareNumberedVersions(v1: NumberedVersion, v2: NumberedVersion): number {
  const compareNum = (n1: number | undefined, n2: number | undefined) => {
    if (n1 === n2) return 0;
    if (n1 === undefined) return -1;
    if (n2 === undefined) return 1;
    if (n2 > n1) return 1;
    return -1;
  };
  const numResult =
    compareNum(v1.major, v2.major) ||
    compareNum(v1.minor, v2.minor) ||
    compareNum(v1.patch, v2.patch);
  if (numResult !== 0) return numResult;
  if (v1.rest === v2.rest) return 0;
  if (!v1.rest) return -1;
  if (!v2.rest) return 1;
  return v1.rest!.localeCompare(v2.rest!);
}

export function compareVersions(v1: Version, v2: Version): number {
  if (v1.symbol === v2.symbol) {
    switch (v1.symbol) {
      case '*':
      case '-':
      case 'latest':
      case 'unreadable':
      case '||':
        return 0;
      default: {
        return compareNumberedVersions(v1, v2 as NumberedVersion);
      }
    }
  }

  if (v1.symbol === 'unreadable') return -1;
  if (v2.symbol === 'unreadable') return 1;
  if (v1.symbol === '*') return -1;
  if (v2.symbol === '*') return 1;
  if (v1.symbol === 'latest') return -1;
  if (v2.symbol === 'latest') return 1;
  if (v1.symbol === '-') return -1;
  if (v2.symbol === '-') return 1;
  if (v1.symbol === '||') return -1;
  if (v2.symbol === '||') return 1;

  return compareNumberedVersions(v1, v2);
}
