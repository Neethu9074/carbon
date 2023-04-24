/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getSapHanaSystem from 'in-sap/subscriptions/getSapHanaSystem';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    sapHanaSystem: getSapHanaSystem({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SapHanaSystemBreadcrumb({ sapHanaSystem }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.sapHanaSystem')} icon="lib_sap_saphanasystem">
        {sapHanaSystem && sapHanaSystem.name}
      </Breadcrumb>
    );
  }
);
