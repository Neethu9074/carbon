import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
export default connectTo(
  {
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.label:"eum-processor"')
  },
  function EumProcessor({ rows, timeConfig }) {
    if (rows.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    rows = rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));

    const labels = rows.map(r => r.host.get('label').replace(/^(eum-processor-\d+).*$/i, '$1'));

    return (
      <div>
        <h1>eum-processor</h1>

        <DashboardSection title={`Host CPU load`}>
          <Chart
            snapshotIds={rows.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              metrics: rows.map(() => 'load.1min'),
              labels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <Columize>
          <DashboardSection title={`Incoming Website Beacons`}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.website_monitoring_beacons.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Failed Incoming Website Beacons`}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.incoming.website_monitoring_beacons.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`Outgoing Processed Website Beacons`}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.outgoing.processed_website_monitoring_beacons.calls`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Failed Outgoing Processed Website Beacons`}>
            <Chart
              snapshotIds={rows.map(r => r.dropwizard.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: rows.map(() => `metrics.meters.KPI.outgoing.processed_website_monitoring_beacons.errors`),
                labels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);
