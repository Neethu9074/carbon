import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { contextGuideEnabled } from 'in-services/featureFlags';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import Stack from 'in-new-components/Stack';
import connectTo from 'in-hoc/connectTo';

import locals from './StackButton.mless';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function StackButton({ id, timeConfig, isInternalVisible }) {
    if (isInternalVisible || contextGuideEnabled) {
      return (
        <Overlay content={() => <Stack id={id} productArea="INFRASTRUCTURE" timeConfig={timeConfig} />}>
          {({ toggle }) => (
            <Button className={locals.button} kind="info" icon="lib_context_guide_stack" onClick={toggle}>
              Stack
            </Button>
          )}
        </Overlay>
      );
    } else {
      return null;
    }
  }
);
