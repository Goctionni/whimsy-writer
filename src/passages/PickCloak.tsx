import { Link } from '../base-components/link';
import { useOnPassage } from '../hooks/useOnPassage';
import { useVariables } from '../store-utils/var-utils';

export function PickCloak() {
  const $var = useVariables();

  useOnPassage(() => ($var.cloaked = true));

  return (
    <div>
      <p>
        You take care to remove the cloak from{' '}
        <Link textLink to="Cloakroom">
          the hook
        </Link>
        , dusting it a little while doing so, and return the delicate cloth atop your shoulders.
      </p>
    </div>
  );
}
