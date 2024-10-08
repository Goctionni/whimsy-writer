import { Link } from '../base-components/link';

export function CoDStart() {
  return (
    <>
      <h1 className="text-center">Cloak of Darkness</h1>
      <p>
        <em>Cloak of Darkness</em> is a test story created by Roger Firth for ADRIFT.
      </p>
      <p>
        This "adventure" is a micro IF designed to be easily ported to any authoring system (a.k.a. the IF equivalent of
        "Hello, world"). It was inspired by Iain Merrick's{' '}
        <a href="https://www.ifwiki.org/Cloak_of_Darkness#Twine" target="_blank">
          Twine port
        </a>{' '}
        in Jonah.
      </p>
      <Link to="Outside">Start Adventure</Link>
      <hr />
      <p>
        Note: The code of this story is using a combination of listed choices and in-text link, as the medium allows
        both.
      </p>
    </>
  );
}
