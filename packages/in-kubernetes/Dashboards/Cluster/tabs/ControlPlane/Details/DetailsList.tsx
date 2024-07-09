/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { DetailsListProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details';
import { InfosProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { getItem } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/utils';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import { Row, Col } from 'in-components/layout/Grid/Grid';

export default function DetailsList({ clusterInfos, clusterId }: DetailsListProps) {
  if (!clusterInfos || clusterInfos.length === 0) {
    return <NoDataAvailable height={160} text={t('in-kubernetes:dashboards.noDebuggingInformation')} />;
  }

  const uuid = getItem('UUID', clusterInfos);
  const leader = getItem('Leader', clusterInfos);
  const hostCoverage = getItem('Host Coverage', clusterInfos);
  const infos = [
    {
      label: t('in-kubernetes:dashboards.hostCoverage'),
      value: hostCoverage?.value,
      nodeValue: null
    },
    {
      label: t('in-kubernetes:dashboards.clusterUuid'),
      value: uuid?.value,
      hasCopyToClipboard: true,
      nodeValue: null
    },
    {
      label: t('in-kubernetes:dashboards.agentMonitor'),
      value: (
        <Link href={`#${clusterDashboardFullyQualified};clusterId=${clusterId}/pods;pod.query=${leader?.value}`}>
          {leader?.value}
        </Link>
      ),
      hasCopyToClipboard: true,
      nodeValue: null
    }
  ];

  return (
    <Row>
      {infos.map(({ label, value, hasCopyToClipboard }: InfosProps, index: number) => (
        <Col lg key={index}>
          <Typography variant="body-small">{label}</Typography>
          {hasCopyToClipboard ? (
            <HorizontalFlexWrapper>
              <Typography variant="heading-200">{value}</Typography>
            </HorizontalFlexWrapper>
          ) : (
            <Typography variant="heading-200">{value}</Typography>
          )}
        </Col>
      ))}
    </Row>
  );
}
