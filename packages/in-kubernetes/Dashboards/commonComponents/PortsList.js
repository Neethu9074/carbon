/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DataTable as CarbonDataTable, Typography } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import WithIcon from 'in-components/WithIcon';
import { t } from 'in-i18n';

import locals from './PortsList.mless';

export default function PortsList({ resource }) {
  const ports = resource.ports;
  if (!ports || ports.length === 0) {
    return null;
  }

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
    <>
      <Typography variant="heading-03">{t('in-kubernetes:dashboards.ports')}</Typography>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
    </>
  );
}
