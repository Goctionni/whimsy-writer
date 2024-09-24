import { Link } from '../base-components/link';
import { useOnPassage } from '../hooks/useOnPassage';
import { useVariables } from '../store-utils/var-utils';

export function HangedCloak() {
  const $var = useVariables();

  useOnPassage(() => ($var.cloaked = false));

  return (
    <div>
      <p>
        You carefully removed the cloak from your person, and hang it on the{' '}
        <Link textLink to="Cloakroom">
          brass hook
        </Link>
        .
      </p>
    </div>
  );
}
