import type { BoxProps, TextProps } from 'ink';
import { Box, Text } from 'ink';
import type { ReactElement, ReactNode } from 'react';
import { Children, useMemo } from 'react';
import { cwd } from 'process';
import { resolve } from 'path';

interface Props {
  path: string;
  targetIsCwd: boolean;
}

export function Created({ path, targetIsCwd }: Props) {
  const directory = useMemo(() => {
    if (targetIsCwd) return cwd();
    return resolve(cwd(), path);
  }, [path, targetIsCwd]);
  return (
    <Box flexDirection="column" gap={1}>
      <Box gap={1}>
        <Text color="green">[Create Whimsy]</Text>
        <Text color="white">Your project has been created</Text>
      </Box>
      <TitledBox title="Where is it?">
        <Text>{directory}</Text>
      </TitledBox>
      <TitledBox title="What to do next?">
        <Text>Open your project using your editor (ie: VSCode)</Text>
        <TitledBox
          title="Inside your project directory"
          titleColor="cyan"
          linePrefix={<Text color="yellow">•</Text>}
        >
          <CmdInstruction>
            Run "<Text color="yellow">npm install</Text>"
          </CmdInstruction>
          <CmdInstruction>
            Check the "<Text color="yellow">readme.md</Text>"
          </CmdInstruction>
          <CmdInstruction>
            Initialize a git repository <Text color="gray">(Optional)</Text>
          </CmdInstruction>
        </TitledBox>
      </TitledBox>
    </Box>
  );
}

type Color = TextProps['color'];

interface TitledBoxProps extends BoxProps {
  title: string;
  titleColor?: Color;
  children?: ReactNode;
  linePrefix?: ReactNode;
}
function TitledBox({
  title,
  titleColor = 'yellow',
  linePrefix,
  flexDirection = 'column',
  paddingLeft = 2,
  children,
  ...restProps
}: TitledBoxProps) {
  return (
    <Box flexDirection="column">
      <Text color={titleColor}>{title}</Text>
      {!linePrefix ? (
        <Box {...{ ...restProps, flexDirection, paddingLeft }}>{children}</Box>
      ) : (
        <Box
          {...{
            ...restProps,
            flexDirection,
            paddingLeft: !linePrefix ? paddingLeft : 0,
          }}
        >
          {Children.map(children, (child) => (
            <Box gap={1}>
              {linePrefix}
              {child}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

interface CmdInstructionProps {
  children: Array<string | ReactElement>;
  gap?: number;
}

function CmdInstruction({ children, gap = 0 }: CmdInstructionProps) {
  return (
    <Box gap={gap}>
      {Children.map(children, (child) => {
        if (typeof child === 'string') {
          return <Text>{child}</Text>;
        }
        return child;
      })}
    </Box>
  );
}
