import { useVariables } from '../store-utils/var-utils';

export function End() {
  const $var = useVariables();
  return (
    <>
      <p>The end</p>
      <p>You scored {$var.score} points</p>
    </>
  );
}
