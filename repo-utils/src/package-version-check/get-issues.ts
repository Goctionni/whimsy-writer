import { compareVersions } from './compare-versions';
import { DependencyInfo, Issue } from './types';

export function getIssue(item: DependencyInfo): Issue | null {
  const hasIssue =
    item.hasVersionMismatch ||
    item.usages.some((usage) => {
      if (!usage.versionIsAllowed) return true;
      if (usage.shouldBeIn !== 'unknown' && usage.shouldBeIn !== usage.in) return true;
      return false;
    });

  if (!hasIssue) return null;

  const workspaceVersions: Issue['workspaceVersions'] = {};
  const highestUsage = item.usages
    .sort((usage1, usage2) => {
      return compareVersions(usage1.version, usage2.version);
    })
    .at(0);

  const targetVersion = highestUsage?.versionIsNumeric ? highestUsage.version : null;

  for (const usage of item.usages) {
    workspaceVersions[usage.repo] = {
      version: usage.version,
      targetVersion: targetVersion,
      hasVersionMismatch: item.hasVersionMismatch,
    };
  }

  return {
    dependency: item.name,
    workspaceVersions,
  };
}
