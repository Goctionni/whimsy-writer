import chalk from 'chalk';
import { writeWorkspaceDependencies } from './read-write-deps';
import { Issue, NumberedVersion, RepoDeps } from './types';

function formatTargetFunction(version: NumberedVersion) {
  return `${version.major}.${version.minor ?? 0}.${version.patch ?? 0}`;
}

export function fixIssues(repoDependencies: RepoDeps, issues: Issue[]) {
  const canFix = issues.filter((issue) => {
    return !!Object.values(issue.workspaceVersions).find((item) => item.targetVersion);
  });

  const fixedRepoDependencies: RepoDeps = {};

  for (const issue of canFix) {
    const targetVersion = Object.values(issue.workspaceVersions).find(
      (item) => item.targetVersion,
    )?.targetVersion;
    if (!targetVersion) throw new Error('Well that shouldnt have happened');
    const targetVersionStr = formatTargetFunction(targetVersion as NumberedVersion);

    for (const [workspace, { version }] of Object.entries(issue.workspaceVersions)) {
      if (version.raw === targetVersionStr) continue;
      if (!(workspace in fixedRepoDependencies)) {
        fixedRepoDependencies[workspace] = {
          dependencies: { ...repoDependencies[workspace].dependencies },
          devDependencies: { ...repoDependencies[workspace].devDependencies },
        };
      }

      if (issue.dependency in repoDependencies[workspace].dependencies) {
        fixedRepoDependencies[workspace].dependencies[issue.dependency] = targetVersionStr;
      }
      if (issue.dependency in repoDependencies[workspace].devDependencies) {
        fixedRepoDependencies[workspace].devDependencies[issue.dependency] = targetVersionStr;
      }
    }
  }
  for (const [workspace, { dependencies, devDependencies }] of Object.entries(
    fixedRepoDependencies,
  )) {
    writeWorkspaceDependencies(workspace, dependencies, devDependencies);
  }

  console.log(chalk.green(`Fixed versions for ${canFix.length} dependencies`));

  return issues.filter((issue) => !canFix.includes(issue));
}
