/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, Button, Stack as StackComponent } from '@instana/components';

import Overlay from 'in-components/overlays/Overlay';
import Stack from 'in-components/Stack';
import { t } from 'in-i18n';

export default function StackButton({
  id,
  applicationId,
  boundaryScope,
  serviceId,
  timeConfig,
  productArea,
  noAutoMargin,
  includeSelfEntity,
  className,
  plugin,
  syntheticCalls,
  size
}) {
  return (
    <Overlay
      align="bottomLeft"
      content={() => (
        <Stack
          id={id}
          applicationId={applicationId}
          boundaryScope={boundaryScope}
          serviceId={serviceId}
          timeConfig={timeConfig}
          productArea={productArea}
          includeSelfEntity={includeSelfEntity}
          plugin={plugin}
          syntheticCalls={syntheticCalls}
        />
      )}
      behindSidebar
      withoutWrapper
    >
      {({ toggle, refSetter, isOpen }) => (
        <Button
          data-no-pdf
          kind="tertiary"
          icon={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
          onClick={toggle}
          size={size ? size : 'compact'}
          refSetter={refSetter}
          noAutoMargin={noAutoMargin}
          className={className}
          aria-haspopup
          aria-expanded={isOpen}
        >
          <StackComponent direction="horizontal" align="center" gap="xsmall">
            <SvgIcon type="lib_context_guide_stack" size="xs" />
            {t('in-components:stack.buttonStack')}
          </StackComponent>
        </Button>
      )}
    </Overlay>
  );
}
