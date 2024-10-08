import { useVariables } from '../store-utils/var-utils';
import { useOnPassage } from '../hooks/useOnPassage';
import { usePreviousPassageName } from '../hooks/usePreviousPassageName';
import { Link } from '../base-components/link';

function BasedOnPrevious() {
  const $var = useVariables();
  const previousPassage = usePreviousPassageName();

  if (previousPassage === 'Outside') {
    return (
      <p>
        Shrugging off the rain from your {$var.cloaked ? 'cloak' : 'bare shoulders'}, you step inside the Opera House,
        sighing of relief. Warmth caress your cold cheeks, before enveloping your whole body.{' '}
        <em>{$var.cloaked ? <>I should rid of this damp cloak!</> : <>How much more comfortable we are inside!</>}</em>
      </p>
    );
  }

  if (previousPassage === 'Bar' && $var.cloaked) {
    return (
      <p>
        You escape, somehow, the unrelenting darkness from the bar, shaking. <em>What… why…</em>
      </p>
    );
  }

  return null;
}

export function Foyer() {
  const $var = useVariables();
  // Increase num visits
  useOnPassage(() => ($var.foyerVisits += 1));

  return (
    <>
      <BasedOnPrevious />
      <p>
        It is in the spacious <strong>Foyer</strong> that you now stand, dazzling you with its grandeur. Akin to its
        much larger sibling in the capital, this hall is adorned with the most intricate and shining of decorations.
        Sculpted, you are sure, from the grandest of masters. Detailed, you can see, with the most precious gems and
        most sparkling of glitters.
      </p>
      <p>
        In this room, you also find three doors: the{' '}
        <Link textLink to="Outside">
          northern one
        </Link>{' '}
        leading back to the street, the{' '}
        <Link textLink to="Bar">
          southern one
        </Link>
        {$var.barvisits > 0 && <>where you remember finding a bar</>}, and the{' '}
        <Link textLink to="Cloakroom">
          western one
        </Link>
        {$var.cloakroomVisits > 0 && <>going to the small cloakroom</>}.
      </p>
      <p>
        <em>Humph… Awfully quiet today…</em>
      </p>
      {$var.cloaked && (
        <p>
          And with the{' '}
          <Link textLink to="Cloak">
            cloak
          </Link>{' '}
          on your shoulders, you start to feel quite warm.
        </p>
      )}
    </>
  );
}
