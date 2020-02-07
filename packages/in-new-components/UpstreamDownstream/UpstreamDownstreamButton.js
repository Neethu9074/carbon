import React, { useState } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import UpstreamDownstream from 'in-new-components/UpstreamDownstream/UpstreamDownstream';
import { contextGuideEnabled } from 'in-services/featureFlags';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function UpstreamDownstreamButton({
    timeConfig,
    isInternalVisible,
    endpointId,
    serviceId,
    applicationId,
    dashboard
  }) {
    const [activeTabIndex, onTabSelect] = useState(0);

    if (isInternalVisible || contextGuideEnabled) {
      return (
        <Overlay
          content={({ close }) => (
            <UpstreamDownstream
              timeConfig={timeConfig}
              activeTabIndex={activeTabIndex}
              onTabSelect={onTabSelect}
              serviceId={serviceId}
              applicationId={applicationId}
              endpointId={endpointId}
              dashboard={dashboard}
              close={close}
            />
          )}
          withoutWrapper
        >
          {({ toggle, refSetter }) => (
            <Button kind="info" icon="lib_context_guide_upstream" onClick={toggle} refSetter={refSetter}>
              Upstream / Downstream
            </Button>
          )}
        </Overlay>
      );
    } else {
      return null;
    }
  }
);
