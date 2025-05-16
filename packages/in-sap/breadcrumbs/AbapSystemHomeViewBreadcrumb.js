/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { sapSystemListFullyQualified } from 'in-sap/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function AbapSystemHomeViewBreadcrumb() {
  const { createHrefToPath } = useNavigation();
  return (
    <Breadcrumb href={createHrefToPath(sapSystemListFullyQualified)} icon="lib_sap_host">
      {t('in-sap:breadcrumbs.abapOrJavaSystem')}
    </Breadcrumb>
  );
}
