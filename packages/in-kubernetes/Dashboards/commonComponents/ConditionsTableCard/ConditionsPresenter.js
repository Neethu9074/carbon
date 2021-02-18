/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';

export default function NodeConditionsPresenter({ conditions }) {
  return (
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
