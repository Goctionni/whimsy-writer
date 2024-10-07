import { Link } from '../base-components/link';
import { useVariables } from '../store-utils/var-utils';

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
        <Link to="WithMarkdown">Continue with pzaz</Link>
      </div>
    </>
  );
}
