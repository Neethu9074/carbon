/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortBy } from 'lodash';
import React from 'react';

import { Card, KeyValue, Li, Ul } from '@instana/components';

import { phasePodListUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { clusterDashboard, kubernetes } from 'in-kubernetes/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { t } from 'in-i18n';

export default function Debugging({ cluster, counters }) {
  const debuggingInfo =
    cluster.debuggingInfo &&
    Object.keys(cluster.debuggingInfo).map(key => ({ key, value: cluster.debuggingInfo[key] }));

  if (counters && counters?.nodes != 0) {
    const coverageRatio = ((counters.hosts / counters.nodes) * 100).toFixed(1);
    const coverage = counters.hosts + ' of ' + counters.nodes + ' - ' + coverageRatio + '%';
    debuggingInfo.push({ key: 'Host Coverage', value: coverage });
  } else {
    debuggingInfo.push({ key: 'Host Coverage', value: '-' });
  }

  return (
    <Card title={t('in-kubernetes:dashboards.debuggingInformation')}>
      <DebugList items={debuggingInfo} />
    </Card>
  );
}

function DebugList({ items }) {
  const { location, createHref } = useNavigation();
  if (!items || items.length === 0) {
    return <NoDataAvailable height={160} text={t('in-kubernetes:dashboards.noDebuggingInformation')} />;
  }

  return (
    <Ul>
      {sortBy(items, item => item.key).map((item, key) => {
        let value = item.value;
        if (item.key === 'Leader') {
          location.pathname = `${kubernetes}${clusterDashboard}${phasePodListUrlParameter.path}`;
          setOrDeleteMatrixKey(location, phasePodListUrlParameter.path, 'pod.query', item.value);
          const href = createHref(location);
          value = <a href={href}>{item.value}</a>;
        }

        return (
          <Li key={`${value}_${key}`}>
            <KeyValue value={value} label={item.key} />
          </Li>
        );
      })}
    </Ul>
  );
}
