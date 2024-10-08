import { Link } from '../base-components/link';
import { useGameState } from '../store-utils/state-store';

export function EndingHome() {
  const restart = useGameState((state) => state.restart);

  return (
    <div className="flex flex-col items-center">
      <p>
        On a second thought, you think it best to retrace your steps and return home. Yet, you can't shake the feeling
        that you missed something in there…
      </p>

      <p className="text-center">
        <strong>Fin?</strong>
      </p>

      <p>
        <Link onClick={restart}>Restart</Link>
      </p>
    </div>
  );
}
