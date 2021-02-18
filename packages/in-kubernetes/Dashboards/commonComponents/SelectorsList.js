/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Table, Thead, Tbody, Th, Tr, Td } from 'in-components/tables/sharedComponents';
import Card from 'in-new-components/Card';

export default function SelectorsList({ resource, defaultOperator = '=' }) {
  const selectors = resource.selectors;
  if (!selectors || selectors.length === 0) {
    return null;
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
