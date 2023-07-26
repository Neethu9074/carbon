/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card, Link, Spacer, Typography } from '@instana/components';

// @ts-expect-error need ts migration
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
// @ts-expect-error
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { TableWidgetProps } from 'in-custom-dashboards/widgets/Table/types';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { MetricItem } from 'in-infrastructure/navigation/paths';
import { KpiDefinition } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Trans } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Table/infrastructure/InfrastructureTableWidget.mless';

export function InfrastructureTableWidget(props: TableWidgetProps) {
  const { config, title, actions, dragHandle, isPreview } = props;

  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const timeConfig = useTimeConfig();

  const { entityType: type = '', tableSize } = config;

  const kpiDefinitions = [] as KpiDefinition[];
  const metrics = [] as MetricItem[];
  const metricMetadatas = useMetricMetadatas({ type, kpiDefinitions });
  const [order, setOrder] = useState(defaultOrder);

  return (
    <Card
      className={locals.widgetCard}
      leftHeaderContent={<Typography variant="heading-300">{title}</Typography>}
      rightHeaderContent={
        <>
          {dragHandle}
          {actions}
        </>
      }
    >
      {/* TODO: needs to pull items totalHits and items from InfrastructureList to be displayed here*/}
      {/*<Typography variant="body-bold">Showing 5 of 2000 Results </Typography>*/}

      <Spacer vertical="normal" />

      <div className={locals.tableArea}>
        <InfrastructureList
          timeConfig={timeConfig}
          type={type}
          order={order}
          setOrder={setOrder}
          tagFilterExpression={[]}
          backendQueryModel={EMPTY_EXPRESSION}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          showHeader={false}
          displayChart={false}
          retrievalSize={tableSize}
          numSkeletonRows={tableSize}
        />

        <div className={locals.viewFullTableLink}>
          <Typography variant="body-regular">
            <Trans
              i18nKey="in-custom-dashboards:widgets.table.form.infrastructure.viewTable"
              components={{
                analyzeInfraLink: (
                  // @ts-expect-error
                  <Link
                    {...(!isPreview && {
                      href: getLinkToInfraEntityExplore({ type })
                    })}
                  />
                )
              }}
            />
          </Typography>
        </div>
      </div>
    </Card>
  );
}
