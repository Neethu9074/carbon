/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import UpstreamDownstream from 'in-new-components/UpstreamDownstream/UpstreamDownstream';
import { contextGuideEnabled } from 'in-services/featureFlags';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './UpstreamDownstreamButton.mless';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function UpstreamDownstreamButton({
    timeConfig,
    isInternalVisible,
    snapshotId,
    endpointId,
    serviceId,
    applicationId,
    className,
    tagFilters,
    plugin
  }) {
    if (isInternalVisible || contextGuideEnabled) {
      return (
        <Overlay
          align="bottomLeft"
          content={({ close }) => (
            <UpstreamDownstream
              timeConfig={timeConfig}
              snapshotId={snapshotId}
              serviceId={serviceId}
              applicationId={applicationId}
              endpointId={endpointId}
              close={close}
              tagFilters={tagFilters}
              plugin={plugin}
            />
          )}
          behindSidebar
          withoutWrapper
        >
          {({ toggle, refSetter, isOpen }) => (
            <Button
              kind="info"
              icon="lib_context_guide_upstream"
              onClick={toggle}
              refSetter={refSetter}
              className={className}
            >
              {t('in-new-components:upstreamDownstream.buttonUpstreamDownstream')}
              <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
            </Button>
          )}
        </Overlay>
      );
    } else {
      return null;
    }
  }
);
