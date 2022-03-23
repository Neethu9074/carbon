/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortBy } from 'lodash';
import React from 'react';

import { Card, KeyValue, Li, Ul } from '@instana/components';

import { clusterDashboardFullyQualified } from '../../../navigation/paths';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { t } from 'in-i18n';

export default function Debugging({ cluster }) {
  const debuggingInfo =
    cluster.debuggingInfo &&
    Object.keys(cluster.debuggingInfo).map(key => ({ key, value: cluster.debuggingInfo[key] }));

  return (
    <Card title={t('in-kubernetes:dashboards.debuggingInformation')}>
      <DebugList items={debuggingInfo} clusterId={cluster.id} />
    </Card>
  );
}

function DebugList({ items, clusterId }) {
  if (!items || items.length === 0) {
    return <NoDataAvailable height={160} text={t('in-kubernetes:dashboards.noDebuggingInformation')} />;
  }

  return (
    <Ul>
      {sortBy(items, item => item.key).map((item, key) => {
        let value = item.value;
        if (item.key === 'Leader') {
          value = (
            <a href={`#${clusterDashboardFullyQualified};clusterId=` + clusterId + '/pods;pod.query=' + item.value}>
              {item.value}
            </a>
          );
        }

        return (
          <Li key={key}>
            <KeyValue value={value} label={item.key} />
          </Li>
        );
      })}
    </Ul>
  );
}
