/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Table, Thead, Tbody, Th, Tr, Td } from 'in-components/tables/sharedComponents';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import WithIcon from 'in-new-components/WithIcon';
import Card from 'in-new-components/Card';

import locals from './PortsList.mless';

export default function PortsList({ resource }) {
  const ports = resource.ports;
  if (!ports || ports.length === 0) {
    return null;
  }

  return (
    <Card title={t('in-kubernetes:dashboards.ports')}>
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>{t('in-kubernetes:dashboards.port')}</Th>
            <Th>{t('in-kubernetes:dashboards.name')}</Th>
            <Th>{t('in-kubernetes:dashboards.protocol')}</Th>
            <Th>{t('in-kubernetes:dashboards.nodePort')}</Th>
            <Th>{t('in-kubernetes:dashboards.targetPort')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ports.map((portConfig, i) => (
            <Tr key={i} size="compact">
              <Td>
                <WithIcon icon="lib_kubernetes_port">{portConfig.port}</WithIcon>
              </Td>
              <Td>{portConfig.name || valueMissingPlaceholder}</Td>
              <Td>{portConfig.protocol}</Td>
              <Td>
                {portConfig.nodePort || <span className={locals.fadedLabel}>{t('in-kubernetes:dashboards.auto')}</span>}
              </Td>
              <Td>{portConfig.targetPort}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
