import React from 'react';

import { msZeroDecimalPlaces, msTwoDecimalPlaces, number, millis } from 'in-services/formatters/number';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import SnapshotForgeInfo from 'in-sdk/components/sidebar/SnapshotForgeInfo';
import getHostSnapshotId from 'in-services/subscription/getHostSnapshotId';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/view';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { luceneEscapeString } from 'in-stores/search/manipulation';
import LoadingIndicator from 'in-components/LoadingIndicator';
import HealthButton from 'in-components/health/HealthButton';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Kpis from 'in-sdk/components/dashboard/summary/Kpis';
import Columize from 'in-sdk/components/dashboard/Columize';
import Kpi from 'in-sdk/components/dashboard/summary/Kpi';
import { getDashboardLink } from 'in-stores/navigation';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import './ServiceInstanceSummary.less';

const block = 'in-service-instance-dashboard';

export default connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.serviceInstanceId)
    };
  },
  function ServiceInstanceSummary({ snapshot, timeframe }) {
    if (!snapshot) {
      return (
        <MaxWidthFullscreenContainer>
          <LoadingIndicator type="dark" />
        </MaxWidthFullscreenContainer>
      );
    }

    const snapshotId = snapshot.get('id');
    let viewTracesQuery = `entity.service.name:"${luceneEscapeString(getLabel(snapshot))}"`;
    return (
      <MaxWidthFullscreenContainer>
        <div className={`${block}__heading`}>
          <BackButton label="Back to service instance list" href$={getSubDashboardLink(`/serviceInstances`)} />
          <div>
            <Button
              className={`${block}__traces-button`}
              kind="secondary"
              size="sm"
              href$={getTraceViewLinkWithQuery(viewTracesQuery)}
            >
              Traces
            </Button>
            <HealthButton size="sm" snapshotId={snapshotId} />
          </div>
        </div>
        <Kpis>
          <Kpi
            label="Calls"
            snapshotId={snapshotId}
            timeframe={timeframe}
            metric={`count`}
            timeWindowAggregation="sum"
            formatter={number.compact}
            errorPercentage={{
              snapshotId,
              metric: 'error_rate',
              timeframe
            }}
          />
          <Kpi
            label="Latency (50th)"
            snapshotId={snapshotId}
            timeframe={timeframe}
            metric={`duration.50th`}
            timeWindowAggregation="mean"
            formatter={millis.fixedCompact}
          />
          <Kpi
            label="Latency (95th)"
            snapshotId={snapshotId}
            timeframe={timeframe}
            metric={`duration.95th`}
            timeWindowAggregation="mean"
            formatter={millis.fixedCompact}
          />
          <Kpi
            label="Instances (mean)"
            snapshotId={snapshotId}
            timeframe={timeframe}
            metric={`instances`}
            timeWindowAggregation="mean"
            formatter={number.compact}
          />
        </Kpis>

        <Info snapshot={snapshot} />

        <DashboardTile title="Calls vs. Latency">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80,
              right: 80
            }}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: ['count', 'error_rate'],
              labels: ['Calls', 'Errors'],
              type: 'countErrorBar',
              aggregation: 'sum'
            }}
            y2={{
              min: 0,
              formatter: millis.fixedCompact,
              metrics: ['duration.mean'],
              labels: ['latency'],
              type: 'line',
              aggregation: 'mean'
            }}
          />
        </DashboardTile>
        <DashboardTile title="Latency Overview">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            height={200}
            margins={{
              left: 80
            }}
            y1={{
              min: 0,
              formatter: msZeroDecimalPlaces,
              tooltipFormatter: msTwoDecimalPlaces,
              metrics: [
                'duration.min',
                'duration.25th',
                'duration.50th',
                'duration.75th',
                'duration.95th',
                'duration.98th',
                'duration.99th',
                'duration.max'
              ],
              labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
              type: 'integral'
            }}
          />
        </DashboardTile>
      </MaxWidthFullscreenContainer>
    );
  }
);

const Info = connectTo(
  props => {
    const physicalEntitySnapshot = getClusterMembers(props.snapshot.get('id'))
      .map(clusterMembers => clusterMembers.first())
      .flatMap(id => (id ? getSnapshot(id) : alwaysNull));
    return {
      physicalEntitySnapshot,
      hostSnapshot: physicalEntitySnapshot.flatMap(physicalEntitySnapshot => {
        if (!physicalEntitySnapshot) {
          return alwaysNull;
        }
        return getHostSnapshotId(physicalEntitySnapshot).flatMap(getSnapshot);
      })
    };
  },
  function Info({ physicalEntitySnapshot, hostSnapshot }) {
    return (
      <Columize>
        <DashboardTile
          title={hostSnapshot ? getSingular(hostSnapshot.get('plugin')) : 'Host Details'}
          href$={hostSnapshot ? getDashboardLink(hostSnapshot.get('id')) : null}
        >
          {hostSnapshot ? <SnapshotForgeInfo snapshot={hostSnapshot} /> : <LoadingIndicator type="dark" />}
        </DashboardTile>
        <DashboardTile
          title={
            physicalEntitySnapshot ? getSingular(physicalEntitySnapshot.get('plugin')) : 'Service Instance Details'
          }
          href$={physicalEntitySnapshot ? getDashboardLink(physicalEntitySnapshot.get('id')) : null}
        >
          {physicalEntitySnapshot ? (
            <SnapshotForgeInfo snapshot={physicalEntitySnapshot} />
          ) : (
            <LoadingIndicator type="dark" />
          )}
        </DashboardTile>
      </Columize>
    );
  }
);
