/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, Button, Stack } from '@instana/components';

import UpstreamDownstream from 'in-components/UpstreamDownstream/UpstreamDownstream';
import { carbonButtonEnabled } from 'in-services/featureFlags';
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
  plugin,
  size
}) {
  if (carbonButtonEnabled) {
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
            kind="tertiary"
            icon={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
            onClick={toggle}
            refSetter={refSetter}
            size={size ? size : 'compact'}
            className={className}
            aria-haspopup
            aria-expanded={isOpen}
          >
            <Stack direction="horizontal" align="center" gap="xsmall">
              <SvgIcon color="currentColor" type="lib_context_guide_upstream" size="xs" />
              {t('in-components:upstreamDownstream.buttonUpstreamDownstream')}
            </Stack>
          </Button>
        )}
      </Overlay>
    );
  }
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
