/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Typography } from '@instana/components';

// @ts-expect-error need ts migration
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { KpiDefinition } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget.mless';
import { MetricItem } from 'in-infrastructure/navigation/paths';

interface InfrastructureTableWidgetProps {
  config: {
    [key: string]: any;
    type?: string; // Typically the pluginId aka entity type, e.g. kubernetesPod
    source: string;
  };
  title?: string;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function InfrastructureTableWidget(props: InfrastructureTableWidgetProps) {
  const { config, title, actions, dragHandle } = props;

  const timeConfig = useTimeConfig();

  const { type = 'kubernetesPod' } = config ?? {};

  const kpiDefinitions = [] as KpiDefinition[];
  const metrics = [] as MetricItem[];
  const metricMetadatas = useMetricMetadatas({ type, kpiDefinitions });

  const [order, setOrder] = useState({
    by: 'label',
    direction: 'ASC'
  });

  return (
    <Card
      className={locals.widgetCard}
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
      leftHeaderContent={<Typography variant="heading-300">{title}</Typography>}
    >
      <div className={locals.tableArea}>
        <InfrastructureList
          timeConfig={timeConfig}
          type={type}
          order={order}
          setOrder={setOrder}
          tagFilterExpression={[]}
          backendQueryModel={{
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: []
          }}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          showHeader={false}
          displayChart={false}
          retrievalSize={5}
          numSkeletonRows={5}
        />
      </div>
    </Card>
  );
}
