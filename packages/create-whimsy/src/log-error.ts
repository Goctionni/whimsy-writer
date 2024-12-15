import chalk from 'chalk';

const lineRegex = /\sat (.*) \(.*:\d+:\d+\)/g;
const linePartsRegex = /^\s+at (.*) \((.*):(\d+):(\d+)\)$/;

export function logError(ex: Error) {
  console.log(`${chalk.red(`[${ex.name}]:`)} ${ex.message}`);

  const stack = ex.stack;
  if (!stack) return null;

  const matches = stack.replace(/\r/g, '').match(lineRegex);
  if (!matches?.length) return;

  for (const line of matches) {
    const [, fn, filepath, lineno, char] = linePartsRegex.exec(line) ?? [];
    console.log(
      [
        '  at ',
        getFn(fn),
        ' (',
        filepath,
        chalk.blue(':'),
        chalk.cyan(lineno),
        chalk.blue(':'),
        chalk.cyan(char),
        ')',
      ].join(''),
    );
  }
}

function getFn(text: string) {
  if (text === '<anonymous>') return chalk.gray(text);
  const parts = text.split('.');
  return parts
    .map((part, i) => {
      if (i === parts.length - 1) return chalk.red(part);
      return chalk.yellow(part);
    })
    .join(chalk.gray('.'));
}
