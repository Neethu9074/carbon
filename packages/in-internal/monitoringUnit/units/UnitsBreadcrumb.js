/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function UnitsBreadcrumb() {
  return (
    <Breadcrumb href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/units'))}>
      {t('in-internal:monitoringUnit.units.unitsBreadcrumb.units')}
    </Breadcrumb>
  );
}
