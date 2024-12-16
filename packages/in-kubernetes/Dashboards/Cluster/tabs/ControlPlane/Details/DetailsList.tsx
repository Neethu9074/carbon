/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { isValidElement, Children } from 'react';

import { Link, SvgIcon, Typography, Spacer } from '@instana/components';
import { t } from '@instana/i18n-react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { DetailsListProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details';
import { InfosProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { getItem } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/utils';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { Row, Col } from 'in-components/layout/Grid/Grid';

import locals from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/DetailsList.mless';

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
      value: hostCoverage?.value
    },
    {
      label: t('in-kubernetes:dashboards.clusterUuid'),
      value: uuid?.value,
      hasCopyToClipboard: true
    },
    {
      label: t('in-kubernetes:dashboards.agentMonitor'),
      value: (
        <Link href={`#${clusterDashboardFullyQualified};clusterId=${clusterId}/pods;pod.query=${leader?.value}`}>
          {leader?.value}
        </Link>
      ),
      hasCopyToClipboard: true
    }
  ];

  return (
    <Row>
      {infos.map(({ label, value, nodeValue, hasCopyToClipboard }: InfosProps, index: number) => (
        <Col lg key={index}>
          <Typography variant="body-small">{label}</Typography>
          {hasCopyToClipboard ? (
            <HorizontalFlexWrapper>
              <Typography variant="heading-200">{nodeValue || value}</Typography>
              <Spacer horizontal="normal" />
              <CopyToClipboard
                getText={() => (isValidElement(value) ? Children.toArray(value.props.children).join('') : `${value}`)}
              >
                {ref => (
                  <span ref={ref} className={locals.copyButton}>
                    <SvgIcon type="lib_actions_copy" size="s" />
                  </span>
                )}
              </CopyToClipboard>
            </HorizontalFlexWrapper>
          ) : (
            <Typography variant="heading-200">{nodeValue ?? value}</Typography>
          )}
        </Col>
      ))}
    </Row>
  );
}
