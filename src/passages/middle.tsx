import { Link } from '../base-components/link';
import { End } from './end';

export function Middle() {
  return (
    <>
      <p>Hero's journey</p>
      <Link to={End}>Continue</Link>
    </>
  );
}
