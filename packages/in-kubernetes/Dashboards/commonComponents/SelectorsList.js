/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, DataTable as CarbonDataTable } from '@instana/components';
import { Table, Thead, Tbody, Th, Tr, Td } from '@instana/legacy';

import { carbonTableEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function SelectorsList({ resource, defaultOperator = '=' }) {
  const selectors = resource.selectors;
  if (!selectors || selectors.length === 0) {
    return null;
  }

  if (carbonTableEnabled) {
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
      <Card title={t('in-kubernetes:dashboards.selector')} disableLayer>
        <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
      </Card>
    );
  }

  return (
    <Card title={t('in-kubernetes:dashboards.selector')}>
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>{t('in-kubernetes:dashboards.key')}</Th>
            <Th>{t('in-kubernetes:dashboards.operator')}</Th>
            <Th>{t('in-kubernetes:dashboards.value')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {selectors.map((selector, i) => (
            <Tr key={i} size="compact">
              <Td>{selector.key}</Td>
              <Td>{selector.operator || defaultOperator}</Td>
              <Td>{selector.value}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
