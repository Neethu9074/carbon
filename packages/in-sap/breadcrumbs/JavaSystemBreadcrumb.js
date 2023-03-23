/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getJavaSystem from 'in-sap/subscriptions/getJavaSystem';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    javaSystem: getJavaSystem({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function JavaSystemBreadcrumb({ javaSystem }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.javaSystem')} icon="lib_sap_javasystem">
        {javaSystem && javaSystem.name}
      </Breadcrumb>
    );
  }
);
