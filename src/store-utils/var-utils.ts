import { useMemo } from 'react';
import { VariableMutation } from './types';
import { GET_RAW_KEY } from './constants';
import { useGameState } from './state-store';

// TODO:
// array.splice
// array.sort
// array.push
// array.pop
// array.shift
// array.unshift
// reverse

type RegisterVariableChange = (newState: unknown, variableMutation: VariableMutation) => void;

function createProxy<T extends object>(data: T, update: RegisterVariableChange, path: Array<string | symbol> = []) {
  const memoizedGet: Record<PropertyKey, unknown> = {};
  const clone = Array.isArray(data) ? data.slice() : { ...data };

  return new Proxy(clone, {
    get(_, prop) {
      if (prop === GET_RAW_KEY) return clone;
      if (prop in memoizedGet) return memoizedGet[prop];
      if (!(prop in clone)) return Reflect.get(clone, prop, clone);
      const value = Reflect.get(clone, prop, clone);
      if (!value) return value;
      const type = typeof value;
      if (type !== 'object') return value;
      const childProxy = createProxy(
        value,
        (newValue, variableMutation) => {
          Reflect.set(clone, prop, newValue, clone);
          update(clone, variableMutation);
        },
        [prop, ...path],
      );
      memoizedGet[prop] = childProxy;
      return childProxy;
    },
    set(_, prop, newValue) {
      const before = Reflect.get(clone, prop, clone);
      const result = Reflect.set(clone, prop, newValue, clone);
      if (result) {
        update(clone, { path: [...path, prop], before, after: newValue });
      }
      return result;
    },
    deleteProperty(_, prop) {
      const before = Reflect.get(clone, prop, clone);
      const result = Reflect.deleteProperty(clone, prop);
      if (result) update(clone, { path: [...path, prop], before, after: undefined });
      return result;
    },
    defineProperty(_, prop, attributes) {
      const before = Reflect.get(clone, prop, clone);
      const result = Reflect.defineProperty(clone, prop, attributes);
      const after = Reflect.get(clone, prop, clone);
      if (result) update(clone, { path: [...path, prop], before, after });
      return result;
    },
  }) as T;
}

function isNewPathParentOfOld(newPath: Array<string | symbol>, oldPath: Array<string | symbol>): boolean {
  if (newPath.length >= oldPath.length) return false;
  return newPath.every((newItem, i) => newItem === oldPath[i]);
}

function isNewPathSameAsOld(newPath: Array<string | symbol>, oldPath: Array<string | symbol>) {
  if (newPath.length !== oldPath.length) return false;
  return newPath.every((newItem, i) => newItem === oldPath[i]);
}

export function useVariables() {
  const vars = useGameState((state) => state.variables);
  return useMemo(() => {
    return createProxy(vars, (newValue, { path, before, after }) => {
      useGameState.setState(({ variableChanges }) => {
        // Remove history items if theyre inside an object/array that's being changed
        const filteredChanges = variableChanges.filter((item) => !isNewPathParentOfOld(path, item.path));
        // Check if we have a mutation that updates the same variable
        const identicalPath = variableChanges.find((item) => isNewPathSameAsOld(item.path, path));
        // If not, simply add this mutation
        if (!identicalPath) {
          return {
            variables: newValue as Variables,
            variableChanges: [...filteredChanges, { path, before, after }],
          };
        }
        // If there is an update on the same variable, remove it; but add the new mutation with the existing before
        return {
          variables: newValue as Variables,
          variableChanges: [
            ...filteredChanges.filter((item) => item !== identicalPath),
            {
              path,
              before: identicalPath.before,
              after,
            },
          ],
        };
      });
    });
  }, [vars]);
}
