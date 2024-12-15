import { argv } from 'process';

interface ArgOptions {
  boolean?: boolean;
  shorthand?: string;
  multiple?: boolean;
}
export function getArg(): string[];
export function getArg(argName: string, options: ArgOptions & { multiple: true }): string[];
export function getArg(
  argName: string,
  options: ArgOptions & { multiple?: false; boolean: true },
): boolean;
export function getArg(
  argName: string,
  options: ArgOptions & { multiple?: false; boolean?: false },
): string;
export function getArg(
  argName?: string,
  { boolean = false, shorthand, multiple = false }: ArgOptions = {},
) {
  const values: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    const prevArg = i === 2 ? null : argv[i - 1];
    if (!argName) {
      // If it starts with a -, its not an unnamed argument
      if (arg.startsWith('-')) continue;
      // If the previous argument starts with a `-` and doesnt have a `=`, this argument is an argument value
      if (prevArg?.startsWith('-') && !prevArg.includes('=')) continue;
      values.push(arg);
    } else if (arg === `--${argName}` || (shorthand && arg === `-${shorthand}`)) {
      if (boolean) return true;
      else if (!multiple) return argv[i + 1];
      else values.push(argv[i + 1]);
    } else if (arg.startsWith(`--${argName}=`) || (shorthand && arg.startsWith(`-${shorthand}=`))) {
      const valueStr = arg.slice(arg.indexOf('=') + 1);
      if (boolean) {
        const normalizedValue = valueStr.toLowerCase().trim();
        if (['1', 'true', 'on', 'yes'].includes(normalizedValue)) return true;
        if (['0', 'false', 'off', 'no'].includes(normalizedValue)) return false;
        throw new Error(`Invalid boolean value: ${valueStr}`);
      } else if (!multiple) {
        return valueStr;
      } else {
        values.push(valueStr);
      }
    }
  }
  if (!argName) return values;
  if (boolean) return false;
  if (!multiple || !values.length) return null;
  return values;
}
