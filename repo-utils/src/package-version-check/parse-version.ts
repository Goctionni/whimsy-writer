import { Version } from './types';

function getNumberPart(str: string) {
  const match = str.match(/(\d+|x)/);
  if (!match) return null;
  return match[0];
}

export function parseVersion(rawStr: string): Version {
  if (rawStr.includes('||')) {
    return {
      symbol: '||',
      options: rawStr.split('||').map((part) => parseVersion(part.trim())),
      raw: rawStr,
    };
  }

  if (rawStr.includes(' - ')) {
    const [from, to] = rawStr.split(' - ').map((part) => parseVersion(part.trim()));
    return {
      symbol: '-',
      from,
      to,
      raw: rawStr,
    };
  }

  if (rawStr === 'latest') return { symbol: 'latest', raw: rawStr };
  if (rawStr === '*') return { symbol: '*', raw: rawStr };

  const symbols = ['^', '~', '>', '<', '>=', '<='] as const;
  const symbol = symbols.find((prefix) => rawStr.startsWith(prefix));
  let index = symbol ? symbol.length : 0;
  const major = getNumberPart(rawStr.slice(index));
  if (major === null) return { symbol: 'unreadable', raw: rawStr };

  index += major.length + 1;
  const minor = getNumberPart(rawStr.slice(index));
  if (minor === null || minor === 'x') return { symbol: symbol ?? '=', major: parseInt(major), raw: rawStr };

  index += minor.length + 1;
  const patch = getNumberPart(rawStr.slice(index));
  if (patch === null || patch === 'x')
    return { symbol: symbol ?? '=', major: parseInt(major), minor: parseInt(minor), raw: rawStr };

  const rest = rawStr.slice(index + patch.length + 1);
  return {
    symbol: symbol ?? '=',
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    rest: rest.length ? rest : undefined,
    raw: rawStr,
  };
}
