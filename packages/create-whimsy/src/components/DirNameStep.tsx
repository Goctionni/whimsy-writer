import { Box, Text } from 'ink';
import type { Dispatch, SetStateAction } from 'react';
import TextInput from 'ink-text-input';

interface Props {
  locked: boolean;
  active: boolean;
  dirName: string;
  setDirName: Dispatch<SetStateAction<string>>;
  nextStep: () => void;
}

export function DirNameStep({ active, dirName, setDirName, nextStep, locked }: Props) {
  if (active) {
    return (
      <Box gap={1}>
        <Text>- Directory name:</Text>
        <TextInput value={dirName} onChange={setDirName} onSubmit={nextStep} />
        <Text color="gray">(Use kebab-case)</Text>
      </Box>
    );
  }

  return (
    <Box gap={1}>
      <Text color="gray">- Directory name:</Text>
      {locked && <Text>🔒</Text>}
      <Text color="gray">{dirName}</Text>
    </Box>
  );
}
