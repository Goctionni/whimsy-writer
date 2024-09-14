import { useMemo } from 'react';
import { useGameState } from '../init';

function createProxy<T extends object>(data: T, update: (newValue: unknown) => unknown) {
  const memoizedGet: Record<PropertyKey, unknown> = {};
  const clone = Array.isArray(data) ? data.slice() : { ...data };

  return new Proxy(data, {
    get(_, prop) {
      if (prop in memoizedGet) return memoizedGet[prop];
      if (!(prop in data)) return Reflect.get(clone, prop, clone);
      const value = Reflect.get(clone, prop, clone);
      if (!value) return value;
      const type = typeof value;
      if (type !== 'object') return value;
      const childProxy = createProxy(value, (newValue) => {
        Reflect.set(clone, prop, newValue, clone);
        update(clone);
      });
      memoizedGet[prop] = childProxy;
      return childProxy;
    },
    set(_, prop, newValue) {
      const result = Reflect.set(clone, prop, newValue, clone);
      if (result) update(clone);
      return result;
    },
    deleteProperty(_, prop) {
      const result = Reflect.deleteProperty(clone, prop);
      if (result) update(clone);
      return result;
    },
    defineProperty(_, prop, attributes) {
      const result = Reflect.defineProperty(clone, prop, attributes);
      if (result) update(clone);
      return result;
    },
  });
}

export function variables() {
  const vars = useGameState.getState().variables;
  return createProxy(vars, (newValue) => {
    useGameState.setState({ variables: newValue as Variables });
  });
}

export function useVariables() {
  const vars = useGameState((state) => state.variables);
  return useMemo(() => {
    return createProxy(vars, (newValue) => {
      useGameState.setState({ variables: newValue as Variables });
    });
  }, [vars]);
}
