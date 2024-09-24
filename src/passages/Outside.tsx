import { Link } from '../base-components/link';
import { useVariables } from '../store-utils/var-utils';

function FoyerNotVisited() {
  return (
    <>
      <p>
        We start our tale on… a dreary autumn evening, where fog is more visible than buildings and rains quiets it all.
        Though it is unwise, you stride confidently through the misty street, not once concerned about the potential
        danger around you, or the pour soaking your{' '}
        <strong>
          <Link textLink to="Cloak">
            cloak
          </Link>
        </strong>
        .
      </p>
      <p>
        Bright light appear ahead, expanding as you approach the famed <strong>Opera House</strong>. A chill runs down
        your spine. <em>Finally!</em>
      </p>
    </>
  );
}

function FoyerVisited({ cloaked }: Variables) {
  // <<else>>Though, if you stay here any longer, it is not just a cold you will catch!<</if>></p>
  return (
    <p>
      You find yourself once more out on the misty street, where rain greets you with quite the enthusiasm.
      {cloaked ? (
        <>
          It is a good thing you still have that{' '}
          <Link textLink to="Cloak">
            cloak
          </Link>{' '}
          on your shoulders…
        </>
      ) : (
        <>Though, if you stay here any longer, it is not just a cold you will catch!</>
      )}
    </p>
  );
}

export function Outside() {
  const $var = useVariables();

  return (
    <>
      {!$var.foyerVisits ? <FoyerNotVisited /> : <FoyerVisited {...$var} />}
      <div className="flex gap-2">
        <Link to="Foyer">Enter the Opera House</Link>
        <Link to="EndingHome">Go Home</Link>
      </div>
    </>
  );
}
