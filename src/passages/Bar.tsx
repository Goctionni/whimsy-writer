import { Link } from '../base-components/link';
import { useOnPassage } from '../hooks/useOnPassage';
import { useVariables } from '../store-utils/var-utils';

export function Bar() {
  const $var = useVariables();
  // Increase num visits
  useOnPassage(() => ($var.barvisits += 1));

  if (!$var.cloaked) {
    return (
      <>
        <p>
          <em>Empty as well… Where</em> is <em>everyone?</em>
        </p>
        <p>
          Contrasting with the opulent entrance, the bar is in much dire state. From the missing decoration, the broken
          down seating arrangements, and the forgotten bottles, this room has clearly seen better days.
        </p>
        <p>Yet, it is on the floor that your eyes are drawn, where strange symbols were left behind in sawdust.</p>
        <ul>
          <li>
            <Link textLink to="Foyer">
              Go back to the Foyer
            </Link>
          </li>
          <li>
            <Link textLink to="EndingMessage">
              Read the Symbols
            </Link>
          </li>
        </ul>
      </>
    );
  }

  if ($var.darkness === 0) {
    return (
      <>
        <p>
          You enter the room, spotting a bar up ahead, but uneasiness washes over you.{' '}
          <em>Something is not right here…</em>
        </p>
        <p>
          Prophetical words, indeed, as the doors slam behind you, leaving you in complete and utter darkness. You try
          to look around, hoping to find the door, but you truly cannot see further than your own nose!
        </p>
        <p>
          <em>How will I get out of here?!</em>
        </p>
        <ul>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go east?
            </Link>
          </li>
          <li>
            <Link textLink to="Foyer">
              Go north?
            </Link>
          </li>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go west?
            </Link>
          </li>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go south?
            </Link>
          </li>
        </ul>
      </>
    );
  } else if ($var.darkness === 1) {
    return (
      <>
        <p>
          You persist in the direction you have chosen… which does not seem to be the correct one, as you are still
          waddling around in the dark, not one bit closer to exciting the room.
        </p>
        <p>
          <em>Left, right, up down… where is that darn door?!</em>
        </p>
        <ul>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go west?
            </Link>
          </li>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go south?
            </Link>
          </li>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go east?
            </Link>
          </li>
          <li>
            <Link textLink to="Foyer">
              Go north?
            </Link>
          </li>
        </ul>
      </>
    );
  } else if ($var.darkness === 2) {
    return (
      <>
        <p>
          It seems that no matter where you go, you still cannot reach the door! or any other object for that matter.
          You know you are going forward, you are sure, but it feels more like you are running in circles more than
          anything else…
        </p>
        <p>
          <em>When I get out… I'm going home!</em>
        </p>
        <ul>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go south?
            </Link>
          </li>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go west?
            </Link>
          </li>
          <li>
            <Link textLink to="Foyer">
              Go north?
            </Link>
          </li>
          <li>
            <Link textLink to="Bar" onClick={() => ($var.darkness += 1)}>
              Go east?
            </Link>
          </li>
        </ul>
      </>
    );
  } else {
    return (
      <>
        <p>
          <strong>THUD!</strong>
        </p>
        <p>
          Having walked into… something, you are not sure whether to groan in pain of your throbbing forehead, or
          rejoice in having found some tangible thing you can finally touch. However, it is not the door you feel under
          your hand, but a blank wall…
        </p>
        <p>
          <em>Could it lead back to the exit?</em>
        </p>
        <ul>
          <li>
            <Link textLink to="Foyer">
              Follow the Wall Around
            </Link>
          </li>
        </ul>
      </>
    );
  }
}
