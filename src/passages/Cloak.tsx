import { Link } from '../base-components/link';
import { usePreviousPassageName } from '../hooks/usePreviousPassageName';
import { useVariables } from '../store-utils/var-utils';

export function Cloak() {
  const previousPassage = usePreviousPassageName();
  const $var = useVariables();
  return (
    <>
      {previousPassage === 'Outside' ? (
        <p>
          In this dreary weather, it is much too dark for you to see anything, but the blurry light of the Opera House
          ahead. Even looking down does not help much, your feet even disappearing inside the mist. If you could not
          feel the soft cloth against your skin, you would not even be able to tell that you are currently wearing a
          cloak.
        </p>
      ) : (
        <>
          <p>
            A delicate and expensive black velvet cloak, one you rarely take outside for fear of ruining it. Yet, for
            some reason, you chose today of all days to adorn it atop your shoulders.
          </p>
          <p>
            Looking intently at the cloak, you think you see the last droplets of rain running towards the ground, but
            you cannot tell for certain. The color of the cloth is so deep and dark, you could swear it is sucking the
            light surrounding it!
          </p>
        </>
      )}
      {previousPassage === 'Cloakroom' && !$var.cloaked && <p>You can see the cloak hanging on the hook.</p>}
      <p>
        I may be best to return to{' '}
        <Link textLink to={previousPassage!}>
          your affairs
        </Link>
        ...
      </p>
    </>
  );
}
