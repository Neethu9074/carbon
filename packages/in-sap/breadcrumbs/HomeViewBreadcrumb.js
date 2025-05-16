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
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function HomeViewBreadcrumb(props) {
  const { createHrefToPath } = useNavigation();
  switch (props.systemPrefix) {
    case 'abapinstances.':
    case 'sapjavainstances.':
    case 'abapinstancessensor.':
      return (
        <Breadcrumb href={createHrefToPath(sapInstanceListFullyQualified)} icon="lib_sap_instances">
          {t('in-sap:breadcrumbs.sapInstances')}
        </Breadcrumb>
      );
    case 'sapdbinstances.':
    case 'sapdbms.':
    case 'sapdbtenant.':
    case 'saphana.':
      return (
        <Breadcrumb href={createHrefToPath(sapDbInstanceListFullyQualified)} icon="lib_sap_dbms">
          {t('in-sap:breadcrumbs.sapDbInstance')}
        </Breadcrumb>
      );
    case 'javasystems.':
    case 'abapsystems.':
    case 'saphanasystems.':
    case 'sapwebdispatchers.':
    case 'abapsystemssensor.':
      return (
        <Breadcrumb href={createHrefToPath(sapSystemListFullyQualified)} icon="lib_sap_host">
          {t('in-sap:breadcrumbs.abapSystems')}
        </Breadcrumb>
      );
  }
}
