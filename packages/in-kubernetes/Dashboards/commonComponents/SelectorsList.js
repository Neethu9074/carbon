/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable, Typography } from '@instana/components';

import { t } from 'in-i18n';

export default function SelectorsList({ resource, defaultOperator = '=' }) {
  const selectors = resource.selectors;
  if (!selectors || selectors.length === 0) {
    return null;
  }

  const carbonHeaders = [
    {
      key: t('in-kubernetes:dashboards.key'),
      header: t('in-kubernetes:dashboards.key')
    },
    {
      key: t('in-kubernetes:dashboards.operator'),
      header: t('in-kubernetes:dashboards.operator')
    },
    {
      key: t('in-kubernetes:dashboards.value'),
      header: t('in-kubernetes:dashboards.value')
    }
  ];

  const carbonRows = selectors.map(({ key, operator, value }, i) => ({
    id: `${i}`,
    [t('in-kubernetes:dashboards.key')]: key,
    [t('in-kubernetes:dashboards.operator')]: operator || defaultOperator,
    [t('in-kubernetes:dashboards.value')]: value
  }));

  return (
    <>
      <Typography variant="heading-03">{t('in-kubernetes:dashboards.selector')}</Typography>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
    </>
  );
}
