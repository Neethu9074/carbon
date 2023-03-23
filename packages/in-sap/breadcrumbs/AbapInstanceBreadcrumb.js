/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getAbapInstance from 'in-sap/subscriptions/getAbapInstance';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    abapInstance: getAbapInstance({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function AbapInstanceBreadcrumb({ abapInstance }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.abapInstance')} icon="lib_sap_instances">
        {abapInstance && abapInstance.name}
      </Breadcrumb>
    );
  }
);
