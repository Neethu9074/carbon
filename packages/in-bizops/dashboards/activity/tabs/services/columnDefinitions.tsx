/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Service, TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import { millis, number } from 'in-services/formatters/number';
import { getChartGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

export interface TimeResult {
  time: number;
}

interface ActivityServiceItem {
  service: Service;
  metrics: { [index: string]: number[][] };
}

interface servicesListProps extends ServerTablePresenterProps<ActivityServiceItem> {
  timeConfig: TimeConfig;
}

export const servicesColumnDefinitions: ColumnDefinition<ActivityServiceItem, servicesListProps>[] = [
  {
    id: 'activity_service_name',
    sortable: true,
    defaultOrderDirection: 'ASC',
    label: t('in-bizops:lists.nameLabel'),
    getContent(item: ActivityServiceItem) {
      let serviceName: string;
      if (item.service?.label) {
        serviceName = item.service?.label;
      } else {
        serviceName = t('in-bizops:lists.unnamedService');
      }

      return ActivityLink(serviceName, item.service?.id);
    }
  },
  {
    id: 'count',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.countLabel'),
    getContent(item: ActivityServiceItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-expect-error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.timeseries_calls}
          metric={item.metrics.calls}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'latency',
    sortable: true,
    defaultOrderDirection: 'DESC',
    label: t('in-bizops:lists.latencyLabel'),
    getContent(item: ActivityServiceItem, { timeConfig, result }) {
      return (
        <SparkChart
          loading={false}
          rollup={getChartGranularity(timeConfig)}
          //@ts-expect-error
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.timeseries_latency}
          metric={item.metrics.latency}
          tooltipFormatter={millis.fixedCompact}
        />
      );
    }
  }
];

function ActivityLink(serviceName: string | undefined, serviceId: string) {
  const { location, createHref } = useNavigation();

  location.pathname = serviceDashboard;
  setOrDeleteMatrixKey(location, serviceDashboard, 'serviceId', serviceId);

  return <Link href={createHref(location)}>{serviceName}</Link>;
}
