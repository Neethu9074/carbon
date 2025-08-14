/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { isValidElement, Children } from 'react';

import { Link, SvgIcon, Typography } from '@instana/components';
import { Button, HStack, Stack } from '@instana/carbon';
import { t } from '@instana/i18n-react';

import { DetailsListProps, InfosProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/types';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { getItem } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/utils';
import { phasePodListUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { clusterDashboard, kubernetes } from 'in-kubernetes/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { Row, Col } from 'in-components/layout/Grid/Grid';

import locals from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/DetailsList.mless';

export default function DetailsList({ clusterInfos }: DetailsListProps) {
  const { location, createHref } = useNavigation();

  if (!clusterInfos || clusterInfos.length === 0) {
    return <NoDataAvailable height={160} text={t('in-kubernetes:dashboards.noDebuggingInformation')} />;
  }

  const uuid = getItem('UUID', clusterInfos);
  const leader = getItem('Leader', clusterInfos);
  const hostCoverage = getItem('Host coverage', clusterInfos);
  const k8SensorVersion = getItem('K8s Sensor Version', clusterInfos);
  location.pathname = `${kubernetes}${clusterDashboard}${phasePodListUrlParameter.path}`;
  setOrDeleteMatrixKey(location, phasePodListUrlParameter.path, 'pod.query', leader?.value);
  const leaderHref = createHref(location);
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
      value: <Link href={leaderHref}>{leader?.value}</Link>,
      hasCopyToClipboard: true
    },
    {
      label: t('in-kubernetes:dashboards.k8SensorVersion'),
      value: k8SensorVersion?.value,
      hasCopyToClipboard: true
    }
  ];

  return (
    <Row>
      {infos.map(({ label, value, nodeValue, hasCopyToClipboard }: InfosProps, index: number) => {
        const contentValue = (
          <Typography component="p" variant="heading-02" noMargin>
            {nodeValue ?? value}
          </Typography>
        );

        return (
          <Col lg key={`${label}_${index}`}>
            <Stack gap={1}>
              <Typography component="p" noMargin variant="body-01">
                {label}
              </Typography>
              <HStack className={locals.stack}>
                {contentValue}
                {hasCopyToClipboard && (
                  <CopyToClipboard
                    getText={() =>
                      isValidElement(value) ? Children.toArray(value.props.children).join('') : `${value}`
                    }
                  >
                    {ref => (
                      <Button
                        ref={ref}
                        className={locals.copyButton}
                        iconSize="xs"
                        size="sm"
                        kind="ghost"
                        iconDescription={t('in-kubernetes:controlPlane.copyToClipboard')}
                        renderIcon={() => <SvgIcon type="lib_actions_copy" size="s" />}
                        hasIconOnly
                      />
                    )}
                  </CopyToClipboard>
                )}
              </HStack>
            </Stack>
          </Col>
        );
      })}
    </Row>
  );
}
