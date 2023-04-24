/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getJavaInstance from 'in-sap/subscriptions/getJavaInstance';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    javaInstance: getJavaInstance({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function JavaInstanceBreadcrumb({ javaInstance }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.javaInstance')} icon="lib_sap_instances">
        {javaInstance && javaInstance.name}
      </Breadcrumb>
    );
  }
);
