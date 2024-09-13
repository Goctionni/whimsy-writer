import { useGameState } from '../init';

function createPathProxy<T>(path: string[] = []) {
  return new Proxy(
    {},
    {
      get(_, prop: string) {
        if (prop === '__path') {
          // Return the current path as a string
          return path;
        }

        // Recursively create a new proxy with the updated path
        return createPathProxy([...path, prop]);
      },
    },
  ) as T;
}

export const $var = createPathProxy<Variables>();

function writeDeep(obj: Record<string, any>, path: string[], value: any) {
  const [first, ...rest] = path;
  const deepValue: any = rest.length ? writeDeep(obj[first], rest, value) : value;
  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      if (index !== parseInt(first)) return item;
      return deepValue;
    });
  }
  return {
    ...obj,
    [first]: deepValue,
  };
}

export function set<T>(variable: T, value: T) {
  const varPath = (variable as { __path: string[] }).__path;
  if (!varPath) throw new Error('Variable-path could not be determined');

  const state = useGameState.getState().variables;

  console.log(varPath, value, state, writeDeep(state, varPath, value));
}
