/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { t } from 'in-i18n';

export default function NodeConditionsPresenter({ conditions }) {
  const carbonHeaders = [
    {
      key: t('in-kubernetes:dashboards.condition'),
      header: t('in-kubernetes:dashboards.condition')
    },
    {
      key: t('in-kubernetes:dashboards.status'),
      header: t('in-kubernetes:dashboards.status')
    },
    {
      key: t('in-kubernetes:dashboards.lastTransitionTime'),
      header: t('in-kubernetes:dashboards.lastTransitionTime')
    },
    {
      key: t('in-kubernetes:dashboards.reason'),
      header: t('in-kubernetes:dashboards.reason')
    },
    {
      key: t('in-kubernetes:dashboards.message'),
      header: t('in-kubernetes:dashboards.message')
    }
  ];

  const carbonRows = conditions.map(({ type, status, lastTransitionTime, reason, message }) => ({
    id: type,
    [t('in-kubernetes:dashboards.condition')]: type,
    [t('in-kubernetes:dashboards.status')]: status,
    [t('in-kubernetes:dashboards.lastTransitionTime')]: lastTransitionTime || valueMissingPlaceholder,
    [t('in-kubernetes:dashboards.reason')]: reason || valueMissingPlaceholder,
    [t('in-kubernetes:dashboards.message')]: message || valueMissingPlaceholder
  }));

  return <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />;
}
