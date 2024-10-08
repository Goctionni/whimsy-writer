import { Link } from '../base-components/link';
import { usePreviousPassageName } from '../hooks/usePreviousPassageName';
import { useVariables } from '../store-utils/var-utils';

export function Cloakroom() {
  const $var = useVariables();
  const previousPassage = usePreviousPassageName();

  return (
    <>
      {previousPassage === 'Foyer' && (
        <p>
          <em>Huh… This is… strange.</em>
        </p>
      )}

      <p>
        You find yourself in another room, empty of life and things. Except maybe for one, against the wall. A lonely
        bronze hook awaits its purpose to be met, last standing where once many were lined.
      </p>

      {!$var.cloaked && <p>The hook holds your cloak.</p>}

      <p>There is only one door, the western one, through which you will return to the Foyer.</p>

      <ul>
        {$var.cloaked ? (
          <li>
            <Link textLink to="HangedCloak">
              Hang your cloak on the hook
            </Link>
          </li>
        ) : (
          <li>
            <Link textLink to="PickCloak">
              Pick up your cloak and wear it
            </Link>
          </li>
        )}
        <li>
          <Link textLink to="Cloak">
            Examine your cloak
          </Link>
        </li>
        <li>
          <Link textLink to="Foyer">
            Return to the Foyer
          </Link>
        </li>
      </ul>
    </>
  );
}
