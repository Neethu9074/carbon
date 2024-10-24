/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useGetHrefWithMutator from 'in-stores/navigation/hooks/useGetHrefWithMutator';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { t } from 'in-i18n';

export default function UnitsBreadcrumb() {
  const getHref = useGetHrefWithMutator();

  return (
    <Breadcrumb href={getHref(params => (params.pathname = '/internal/monitoringUnit/units'))}>
      {t('in-internal:monitoringUnit.units.unitsBreadcrumb.units')}
    </Breadcrumb>
  );
}
