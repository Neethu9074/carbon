/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './ColorCodingToggleButtons.mless';

export default function ColorCodingToggleButtons({ setColorCodeMechanism, colorCodeType }) {
  return (
    <div className={locals.wrapper}>
      <label className={locals.label}>Colorize by</label>
      <ButtonGroup
        buttonPropsList={[
          {
            text: 'Endpoint',
            key: 'byServiceAndEndpoint',
            onClick: () => setColorCodeMechanism('byServiceAndEndpoint')
          },
          {
            text: t('in-analyze:traceDetails.buttonTechnology'),
            key: 'byEndpointType',
            onClick: () => setColorCodeMechanism('byEndpointType')
          }
        ]}
        activeKey={colorCodeType}
      />
    </div>
  );
}
