/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getSapDbTenant from 'in-sap/subscriptions/getSapDbTenant';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    sapdbTenant: getSapDbTenant({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SapDbTenantBreadcrumb({ sapdbTenant }) {
    return (
      <Breadcrumb label={t('in-sap:breadcrumbs.sapDbTenant')} icon="lib_sap_dbms">
        {sapdbTenant && sapdbTenant.name}
      </Breadcrumb>
    );
  }
);
