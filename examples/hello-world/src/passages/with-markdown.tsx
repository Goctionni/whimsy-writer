import Markdown from 'react-markdown';
import { useVariables } from '../store-utils/var-utils';

export function WithMarkdown() {
  const $var = useVariables();

  return (
    <Markdown>
      {`
# Boom!

It all exploded before your eyes, and just when you'd scored ${$var.score} points too!
`}
    </Markdown>
  );
}
