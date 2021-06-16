/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import UpstreamDownstream from 'in-components/UpstreamDownstream/UpstreamDownstream';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './UpstreamDownstreamButton.mless';

export default function UpstreamDownstreamButton({
  timeConfig,
  snapshotId,
  endpointId,
  serviceId,
  applicationId,
  className,
  tagFilters,
  plugin
}) {
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
          {t('in-components:upstreamDownstream.buttonUpstreamDownstream')}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}
