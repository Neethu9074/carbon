/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';
import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { carbonTableEnabled } from 'in-services/featureFlags';
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

  return carbonTableEnabled ? (
    <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
  ) : (
    <Table tableInCard>
      <Thead>
        <Tr size="compact">
          <Th>{t('in-kubernetes:dashboards.condition')}</Th>
          <Th>{t('in-kubernetes:dashboards.status')}</Th>
          <Th>{t('in-kubernetes:dashboards.lastTransitionTime')}</Th>
          <Th>{t('in-kubernetes:dashboards.reason')}</Th>
          <Th>{t('in-kubernetes:dashboards.message')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {conditions.map(condition => (
          <Tr key={condition.type} size="compact">
            <Td>{condition.type}</Td>
            <Td>{condition.status}</Td>
            <Td>{condition.lastTransitionTime || valueMissingPlaceholder}</Td>
            <Td>{condition.reason || valueMissingPlaceholder}</Td>
            <Td>{condition.message || valueMissingPlaceholder}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
