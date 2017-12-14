import React from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { msTwoDecimalPlaces, number } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getConnectedEntities } from 'in-stores/connectedEntities';
import EntityInformation from 'in-components/EntityInformation';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import './Endpoint.less';

const block = 'in-service-connection-dashboard-endpoint';

export default connectTo(
  props => {
    return {
      endpointSnapshot: getConnectedEntities(props.snapshotId).flatMap(connectedEntity => {
        const id = props.type === 'source' ? 'sourceId' : 'destinationId';
        if (!connectedEntity || !connectedEntity.get(id)) {
          return alwaysNull;
        }
        return getSnapshot(connectedEntity.get(id));
      })
    };
  },
  function Endpoint({ endpointSnapshot, type }) {
    if (!endpointSnapshot) {
      return (
        <DashboardTile title={type}>
          <div className={`${block}__icon-wrapper`}>
            <SvgIcon type="crossed_circle" color="#bec7cb" height={36} width={36} />
          </div>
        </DashboardTile>
      );
    }
    const snapshotId = endpointSnapshot.get('id');

    return (
      <DashboardTile title={type} href$={getDashboardLink(snapshotId)}>
        <EntityInformation snapshot={endpointSnapshot} />
        <div style={{ marginTop: 16 }} />
        <Chart
          snapshotId={snapshotId}
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
            formatter: msTwoDecimalPlaces,
            metrics: ['duration.mean'],
            labels: ['latency'],
            type: 'line',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    );
  }
);
