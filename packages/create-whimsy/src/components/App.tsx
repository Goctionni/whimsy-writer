import type { ReactNode} from 'react';
import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { NameStep } from './NameStep';
import { DirNameStep } from './DirNameStep';
import { Confirm } from './Confirm';
import { Created } from './end-screens/Created';
import { Aborted } from './end-screens/Aborted';
import { ErrorMessage } from './end-screens/ErrorMessage';

interface Props {
  name: string;
  dirName: string;
  targetIsCwd: boolean;
  createProject: (name: string, dirName: string) => void;
  exitApp: (node: ReactNode, exitCode?: number, ex?: Error) => null;
}

export function App(props: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(props.name);
  const [dirName, setDirName] = useState(props.dirName);

  function nextStep() {
    if (step === 0 && !name) return;
    if (step === 1 && !dirName) return;
    if (step === 0 && props.targetIsCwd) return setStep(2);
    return setStep((cur) => cur + 1);
  }

  function onConfirm(result: boolean | null) {
    if (result === null) return props.exitApp(<Aborted />);
    if (!result) return setStep(0);
    try {
      props.createProject(name, dirName);
      props.exitApp(<Created path={dirName} targetIsCwd={props.targetIsCwd} />);
    } catch (ex) {
      if (ex instanceof Error) {
        props.exitApp(<ErrorMessage />, 1, ex);
      } else {
        props.exitApp(<ErrorMessage />, 1);
      }
    }
  }

  return (
    <Box flexDirection="column">
      <Box gap={1} paddingBottom={1}>
        <Text color="yellow">Create Whimsy</Text>
        <Text color="gray">-</Text>
        <Text color="cyan">Setting up your whimsy-writer story</Text>
      </Box>
      <NameStep active={step === 0} name={name} setName={setName} nextStep={nextStep} />
      <DirNameStep
        active={step === 1}
        dirName={dirName}
        setDirName={setDirName}
        nextStep={nextStep}
        locked={props.targetIsCwd}
      />
      {step === 2 && <Confirm onSubmit={onConfirm} />}
    </Box>
  );
}
