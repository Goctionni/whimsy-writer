import { Box, Text } from 'ink';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';
import TextInput from 'ink-text-input';

interface Props {
  active: boolean;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  nextStep: () => void;
}

export function NameStep({ active, name, setName, nextStep }: Props) {
  if (active) {
    return (
      <Box gap={1}>
        <Text>- Name of your project:</Text>
        <TextInput value={name} onChange={setName} onSubmit={nextStep} />
      </Box>
    );
  }

  return (
    <Box gap={1}>
      <Text color="gray">- Name of your project:</Text>
      <Text color="gray">{name}</Text>
    </Box>
  );
}
