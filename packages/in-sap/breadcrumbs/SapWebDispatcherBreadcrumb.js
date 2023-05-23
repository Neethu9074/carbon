/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getSapWebDispatcher from 'in-sap/subscriptions/getSapWebDispatcher';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    sapWebDispatcher: getSapWebDispatcher({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SapWebDispatcherBreadcrumb({ sapWebDispatcher }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.sapWebDispatcher')} icon="lib_sap_sapWebDispatcher">
        {sapWebDispatcher && sapWebDispatcher.name}
      </Breadcrumb>
    );
  }
);
