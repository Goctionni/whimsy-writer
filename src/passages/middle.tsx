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
      <Link to="End">Continue</Link>
      <Link to="WithMarkdown">Continue with pzaz</Link>
    </>
  );
}

export const NamedExpression = () => 'bla';

const NamedExpression2 = () => 'bla';
// const NamedExpression3 = () => 'bla';

export { NamedExpression2 };

export default function NamedFunction() {
  return '';
}

// export default NamedFunction;
