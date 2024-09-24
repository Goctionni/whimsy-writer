import { Link } from '../base-components/link';
import { useGameState } from '../store-utils/state-store';
import { useVariables } from '../store-utils/var-utils';

export function EndingMessage() {
  const $var = useVariables(); // Access variables such as $var.barVisits
  const restart = useGameState((state) => state.restart); // Hook for restart functionality

  return (
    <div className="flex flex-col items-center">
      {$var.barvisits > 3 ? (
        <p>
          Strangely still legible among the many footsteps you've left behind, the message marked in sawdust reads…
          <br />
          <em>You have lost…</em>
        </p>
      ) : (
        <p>
          Spelled with sawdust, the left-behind message reads…
          <br />
          <em>You have won!</em>
        </p>
      )}

      <p className="text-center">
        <strong>Fin!</strong>
      </p>

      <p>
        <Link onClick={restart}>Restart</Link>
      </p>
    </div>
  );
}
