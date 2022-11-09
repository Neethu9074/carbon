/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

import locals from './ColorCodingToggleButtons.mless';

interface Props {
  setColorCodeMechanism: (colorCode: string) => void;
  colorCodeType: string;
}

export default function ColorCodingToggleButtons({ setColorCodeMechanism, colorCodeType }: Props) {
  return (
    <div className={locals.wrapper}>
      <label className={locals.label}>
        {t('in-analyze:traceDetail.components.colorCodingToggleButtons.colorizeBy')}
      </label>
      <ButtonGroup
        buttonPropsList={[
          {
            text: t('in-analyze:traceDetail.components.colorCodingToggleButtons.endpoint'),
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
