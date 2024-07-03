/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import DeployTabSelection from 'in-synthetics/createLocation/steps/DeployTabSelection';
import { PoPProperties } from 'in-synthetics/utils/constants';
import Overlay from 'in-components/overlays/Overlay/Overlay';

export default function PopDeployButton({ downloadKey, agentKey, syntheticAcceptorURL }: PoPProperties) {
  return (
    <Overlay
      withoutWrapper
      align="topLeft"
      props={{ downloadKey, agentKey, syntheticAcceptorURL }}
      content={DeployTabSelection}
    >
      {({ toggle, refSetter }) => (
        <Button
          // @ts-expect-error missing properties
          refSetter={refSetter}
          onClick={() => {
            toggle();
          }}
          kind="info"
          icon="lib_synthetic_location"
        >
          {t('in-synthetics:dashboard.testList.popDialog.button')}
        </Button>
      )}
    </Overlay>
  );
}
