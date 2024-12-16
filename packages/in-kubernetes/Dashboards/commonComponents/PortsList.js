/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, DataTable as CarbonDataTable } from '@instana/components';
import { Table, Thead, Tbody, Th, Tr, Td } from '@instana/legacy';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { carbonTableEnabled } from 'in-services/featureFlags';
import WithIcon from 'in-components/WithIcon';
import { t } from 'in-i18n';

import locals from './PortsList.mless';

export default function PortsList({ resource }) {
  const ports = resource.ports;
  if (!ports || ports.length === 0) {
    return null;
  }

  if (carbonTableEnabled) {
    const carbonHeaders = [
      {
        key: t('in-kubernetes:dashboards.port'),
        header: t('in-kubernetes:dashboards.port')
      },
      {
        key: t('in-kubernetes:dashboards.name'),
        header: t('in-kubernetes:dashboards.name')
      },
      {
        key: t('in-kubernetes:dashboards.protocol'),
        header: t('in-kubernetes:dashboards.protocol')
      },
      {
        key: t('in-kubernetes:dashboards.nodePort'),
        header: t('in-kubernetes:dashboards.nodePort')
      },
      {
        key: t('in-kubernetes:dashboards.targetPort'),
        header: t('in-kubernetes:dashboards.targetPort')
      }
    ];

    const carbonRows = ports.map(({ port, name, protocol, nodePort, targetPort }) => ({
      id: name,
      [t('in-kubernetes:dashboards.port')]: <WithIcon icon="lib_kubernetes_port">{port}</WithIcon>,
      [t('in-kubernetes:dashboards.name')]: name || valueMissingPlaceholder,
      [t('in-kubernetes:dashboards.protocol')]: protocol,
      [t('in-kubernetes:dashboards.nodePort')]: nodePort || (
        <span className={locals.fadedLabel}>{t('in-kubernetes:dashboards.auto')}</span>
      ),
      [t('in-kubernetes:dashboards.targetPort')]: targetPort
    }));

    return (
      <Card title={t('in-kubernetes:dashboards.ports')} disableLayer>
        <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
      </Card>
    );
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
