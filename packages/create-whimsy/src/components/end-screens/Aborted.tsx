import { Box, Text } from 'ink';
import React from 'react';

export function Aborted() {
  return (
    <Box gap={1}>
      <Text color="yellow">[Create Whimsy]</Text>
      <Text color="white">Setup aborted</Text>
    </Box>
  );
}
