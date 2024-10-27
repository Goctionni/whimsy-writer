import { useVariables } from 'whimsy-writer';

export function End() {
  const $var = useVariables();
  return (
    <>
      <p>The end</p>
      <p>You scored {$var.score} points</p>
    </>
  );
}
