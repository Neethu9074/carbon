/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  sapSystemListFullyQualified,
  sapDbInstanceListFullyQualified,
  sapInstanceListFullyQualified
} from 'in-sap/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb(props) {
  switch (props.systemPrefix) {
    case 'abapinstances.':
    case 'sapjavainstances.':
      return (
        <Breadcrumb href$={getView(sapInstanceListFullyQualified)} icon="lib_sap_instances">
          {t('in-sap:breadcrumbs.sapInstances')}
        </Breadcrumb>
      );
    case 'sapdbinstances.':
    case 'sapdbms.':
    case 'sapdbtenant.':
    case 'saphana.':
      return (
        <Breadcrumb href$={getView(sapDbInstanceListFullyQualified)} icon="lib_sap_dbms">
          {t('in-sap:breadcrumbs.sapDbInstance')}
        </Breadcrumb>
      );
    case 'javasystems.':
    case 'abapsystems.':
      return (
        <Breadcrumb href$={getView(sapSystemListFullyQualified)} icon="lib_sap_host">
          {t('in-sap:breadcrumbs.abapSystems')}
        </Breadcrumb>
      );
  }
}
