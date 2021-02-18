/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { contextGuideEnabled } from 'in-services/featureFlags';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';
import Stack from 'in-new-components/Stack';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './StackButton.mless';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function StackButton({
    id,
    applicationId,
    boundaryScope,
    serviceId,
    timeConfig,
    isInternalVisible,
    productArea,
    noAutoMargin,
    includeSelfEntity,
    className,
    plugin
  }) {
    if (isInternalVisible || contextGuideEnabled) {
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
              {t('in-new-components:stack.buttonStack')}
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
