/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, Button, Stack } from '@instana/components';

import UpstreamDownstream from 'in-components/UpstreamDownstream/UpstreamDownstream';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

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
          data-no-pdf
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
