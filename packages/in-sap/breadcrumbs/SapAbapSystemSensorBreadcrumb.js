/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getSapAbapSensor from 'in-sap/subscriptions/getSapAbapSensor';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    sapAbap: getSapAbapSensor({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SapAbapSensorBreadcrumb({ sapAbap }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.sapAbapSystemSensor')} icon="lib_sap_sapAbapSystemSensor">
        {sapAbap && sapAbap.name}
      </Breadcrumb>
    );
  }
);
