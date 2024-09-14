import { Link } from '../base-components/link';
import { useVariables } from '../store-utils/var-utils';
import { End } from './end';

export function Middle() {
  const $var = useVariables();
  Object.assign(window, { $var });

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
      <Link to={End}>Continue</Link>
    </>
  );
}
