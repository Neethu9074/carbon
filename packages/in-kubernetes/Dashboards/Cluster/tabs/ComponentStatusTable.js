/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { compare } from 'in-services/util/boolean';
import { t } from 'in-i18n';

export default function ComponentStatusTable({ cluster }) {
  const componentStatuses = cluster.componentStatuses || [];
  return (
    <Card title={t('in-kubernetes:dashboards.componentStatus')}>
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>{t('in-kubernetes:dashboards.component')}</Th>
            <Th>{t('in-kubernetes:dashboards.message')}</Th>
            <Th>{t('in-kubernetes:dashboards.conditionStatus')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(componentStatuses || [])
            .slice()
            .sort((a, b) => compare(a.healthy, b.healthy))
            .map((componentStatus, i) => (
              <Tr key={i} size="compact">
                <Td>{componentStatus.name}</Td>
                <Td>{componentStatus.conditionMessage}</Td>
                <Td>{componentStatus.conditionStatus}</Td>
              </Tr>
            ))}
          {componentStatuses.length === 0 && (
            <Tr size="compact">
              <Td colSpan="3">
                <NoDataAvailable text={t('in-kubernetes:dashboards.noComponentStatusDataAvailable')} height={80} />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Card>
  );
}
