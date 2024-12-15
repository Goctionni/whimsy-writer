import { Box, Text, useInput } from 'ink';
import { useState } from 'react';

interface Props {
  text?: string;
  onSubmit: (result: boolean | null) => void;
}
export function Confirm({ text = 'Are these settings correct?', onSubmit }: Props) {
  const [accept, setAccept] = useState<boolean | null>(true);

  useInput((_, key) => {
    if (key.return) {
      return onSubmit(accept);
    }
    if (key.leftArrow) {
      if (accept === true) return;
      if (accept === false) return setAccept(true);
      if (accept === null) return setAccept(false);
    }
    if (key.rightArrow) {
      if (accept === true) return setAccept(false);
      if (accept === false) return setAccept(null);
      if (accept === null) return;
    }
  });

  return (
    <Box paddingTop={1} gap={1}>
      <Text>{text}</Text>
      {accept ? <Text color="green">[Yes]</Text> : <Text color="gray">{` Yes `}</Text>}
      {accept === false ? <Text color="red">[No]</Text> : <Text color="gray">{` No `}</Text>}
      {accept === null ? (
        <Text color="yellow">[Abort]</Text>
      ) : (
        <Text color="gray">{` Abort `}</Text>
      )}
    </Box>
  );
}
