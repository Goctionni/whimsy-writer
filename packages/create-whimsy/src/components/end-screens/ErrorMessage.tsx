import { Box, Text } from 'ink';

export function ErrorMessage() {
  return (
    <Box gap={1}>
      <Text color="yellow">[Create Whimsy]</Text>
      <Text color="white">An error has occurred</Text>
    </Box>
  );
}
