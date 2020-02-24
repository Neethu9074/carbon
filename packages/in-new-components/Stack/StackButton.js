import React, { useState } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { contextGuideEnabled } from 'in-services/featureFlags';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import Stack from 'in-new-components/Stack';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function StackButton({ id, applicationId, timeConfig, isInternalVisible, productArea }) {
    const [activeTabIndex, onTabSelect] = useState(0);

    if (isInternalVisible || contextGuideEnabled) {
      return (
        <Overlay
          align="bottomLeft"
          content={() => (
            <Stack
              id={id}
              applicationId={applicationId}
              timeConfig={timeConfig}
              productArea={productArea}
              activeTabIndex={activeTabIndex}
              onTabSelect={onTabSelect}
            />
          )}
          withoutWrapper
        >
          {({ toggle, refSetter }) => (
            <Button kind="info" icon="lib_context_guide_stack" onClick={toggle} refSetter={refSetter}>
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
