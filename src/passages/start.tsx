import { Link } from '../base-components/link';
import { Middle } from './middle';

export function Start() {
  return (
    <>
      <p>Where the story begins</p>
      <Link to={Middle}>Continue</Link>
    </>
  );
}
