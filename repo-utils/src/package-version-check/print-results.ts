import chalk from 'chalk';
import { Issue, Version } from './types';
import stripAnsi from 'strip-ansi';

function length(str: string) {
  return stripAnsi(str).length;
}

function formatVersion(version: Version, isOld?: boolean, isNew?: boolean): string {
  if (version.symbol === 'unreadable') return `${version.raw} (${chalk.red('Error')})`;
  if (version.symbol === '*') return chalk.red('*');
  if (version.symbol === 'latest') return chalk.red('*');
  if (version.symbol === '-') {
    return [
      formatVersion(version.from, isOld),
      chalk.red('-'),
      formatVersion(version.to, isOld),
    ].join(' ');
  }
  if (version.symbol === '||') {
    return version.options.map((item) => formatVersion(item, isOld)).join(chalk.red(' || '));
  }
  const symbol = version.symbol === '=' && !version.raw.startsWith('=') ? '' : version.symbol;
  const colorFn = isOld ? chalk.red : isNew ? chalk.green : (str: string) => str;
  let str = symbol ? chalk.red(symbol) : '';
  str += colorFn(`${version.major}`);
  if (typeof version.minor === 'number') str += colorFn(`.${version.minor}`);
  if (typeof version.patch === 'number') str += colorFn(`.${version.patch}`);
  if (version.rest) str += colorFn(`-${version.rest}`);
  return str;
}

export function printResults(issues: Issue[]) {
  if (!issues.length) {
    console.log(chalk.green('No dependency-version issues found.'));
    return;
  }

  console.log(chalk.red(`Issues with ${issues.length} dependencies found`));
  console.log('');

  const deps = issues.map((issue) => issue.dependency);
  const workspaces = [
    ...new Set(issues.map((issue) => Object.keys(issue.workspaceVersions)).flat()),
  ].toSorted();
  const longestDepName = Math.max(...deps.map((dep) => dep.length));

  // Header line
  const lines: string[][] = [];
  lines.push(['', ...workspaces]);

  for (const issue of issues) {
    const line: string[] = [];
    line.push(issue.dependency.padEnd(longestDepName, ' '));
    for (const ws of workspaces) {
      const versionInfo = issue.workspaceVersions[ws] ?? null;
      if (!versionInfo) line.push('');
      else {
        const { version, targetVersion, hasVersionMismatch } = versionInfo;
        let isOld = false;
        let isNew = false;
        if (hasVersionMismatch) {
          if (!targetVersion) {
            isOld = true;
          } else {
            isOld = version.raw !== targetVersion.raw;
            isNew = version.raw === targetVersion.raw;
          }
        }
        line.push(formatVersion(version, isOld, isNew));
      }
    }
    lines.push(line);
  }

  const colSizes: number[] = [];
  for (let i = 0; i < lines[0].length; i++) {
    colSizes.push(Math.max(...lines.map((line) => length(line[i] ?? ''))));
  }

  for (const line of lines) {
    const lineStr: string[] = [];
    for (let i = 0; i < line.length; i++) {
      const col = line[i];
      const colSize = colSizes[i];
      const contentWidth = length(col);
      lineStr.push(col + ' '.repeat(colSize - contentWidth));
    }
    console.log(lineStr.join(chalk.dim(' | ')));
  }
}
