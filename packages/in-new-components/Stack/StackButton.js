import React from 'react';

import Overlay from 'in-new-components/overlays/Overlay';
import { nonServicePlugins } from 'in-forge/constants';
import Button from 'in-new-components/Button';
import Stack from 'in-new-components/Stack';

import locals from './StackButton.mless';

export default function StackButton({ id, timeConfig, plugin }) {
  const stackIsDisabled = plugin !== nonServicePlugins.nodeJsRuntimePlatform;

  return (
    <Overlay content={() => <Stack id={id} productArea="INFRASTRUCTURE" timeConfig={timeConfig} />}>
      {({ toggle }) => (
        <Button
          className={locals.button}
          kind="info"
          icon="lib_context_guide_stack"
          onClick={toggle}
          disabled={stackIsDisabled}
        >
          Stack
        </Button>
      )}
    </Overlay>
  );
}
