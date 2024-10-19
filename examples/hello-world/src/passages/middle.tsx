import { Link, useVariables } from 'whimsy-writer';

export function Middle() {
  const $var = useVariables();

  function scorePoint() {
    $var.score += 1;
  }

  return (
    <>
      <p>Hero's journey</p>
      <p>
        Score: {$var.score}{' '}
        <button className="ww-btn" onClick={scorePoint}>
          +1
        </button>
      </p>
      <div className="flex gap-2">
        <Link to="End">Continue</Link>
        <Link to="Middle">Walk in a circle</Link>
      </div>
    </>
  );
}
