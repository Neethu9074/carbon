/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getAbapSystem from 'in-sap/subscriptions/getAbapSystem';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    abapSystem: getAbapSystem({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function AbapSystemBreadcrumb({ abapSystem }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.abapSystem')} icon="lib_sap_system">
        {abapSystem && abapSystem.name}
      </Breadcrumb>
    );
  }
);
