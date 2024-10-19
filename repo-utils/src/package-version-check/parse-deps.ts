import { parseVersion } from './parse-version';
import { DependencyInfo, RepoDeps, Usage } from './types';

function isCleanVersion(str: string) {
  return /^\d+\.\d+\.\d+$/.test(str);
}

function isAllowedVersion(str: string) {
  return /^\d+\.\d+\.\d+(-[^\s]+)?$/.test(str);
}

function isNumericVersion(str: string) {
  return /^(\^|~|>|<|>=|<=|=)?\d+(\.\d+(\.\d+)?)?$/.test(str);
}

function depShouldBeIn(name: string): Usage['shouldBeIn'] {
  if (name.startsWith('@types/')) return 'devDependencies';
  return 'unknown';
}

function addDeps(depsInfo: DependencyInfo[], repo: string, deps: Record<string, string>, dev: boolean) {
  for (const [dep, versionRaw] of Object.entries(deps)) {
    let depInfo = depsInfo.find((item) => item.name === dep);
    if (!depInfo) {
      depInfo = {
        name: dep,
        hasVersionMismatch: false,
        usages: [],
      };
      depsInfo.push(depInfo);
    }

    depInfo.usages.push({
      repo,
      version: parseVersion(versionRaw),
      versionIsAllowed: isAllowedVersion(versionRaw),
      versionIsClean: isCleanVersion(versionRaw),
      versionIsNumeric: isNumericVersion(versionRaw),
      in: dev ? 'devDependencies' : 'dependencies',
      shouldBeIn: depShouldBeIn(dep),
    });

    if (!depInfo.hasVersionMismatch && depInfo.usages.length > 1) {
      depInfo.hasVersionMismatch = depInfo.usages.at(-2)?.version.raw !== versionRaw;
    }
  }
}

export function parseRepoDeps(repoDeps: RepoDeps) {
  const depsInfo: DependencyInfo[] = [];
  for (const [repo, { dependencies, devDependencies }] of Object.entries(repoDeps)) {
    addDeps(depsInfo, repo, dependencies, false);
    addDeps(depsInfo, repo, devDependencies, true);
  }
  return depsInfo;
}
