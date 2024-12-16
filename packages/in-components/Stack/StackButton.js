/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon, Button, Stack as StackComponent } from '@instana/components';

import { carbonButtonEnabled } from 'in-services/featureFlags';
import Overlay from 'in-components/overlays/Overlay';
import Stack from 'in-components/Stack';
import { t } from 'in-i18n';

import locals from './StackButton.mless';

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
  if (carbonButtonEnabled) {
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
          kind="info"
          icon="lib_context_guide_stack"
          onClick={toggle}
          refSetter={refSetter}
          noAutoMargin={noAutoMargin}
          className={className}
        >
          {t('in-components:stack.buttonStack')}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}
