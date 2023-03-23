/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getSAPDbms from 'in-sap/subscriptions/getSAPDbms';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    sapdbms: getSAPDbms({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SapDbmsBreadcrumb({ sapdbms }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.sapdbms')} icon="lib_sap_dbms">
        {sapdbms && sapdbms.name}
      </Breadcrumb>
    );
  }
);
