import { ResponsiveSankey } from 'nivo';
import React from 'react';

import {
  getData,
  sizeByCalls
} from 'in-sdk/components/dashboard/LogicalServiceDashboard/tabs/Connections/ConnectionSankey/data';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    data: getData({ snapshot: props.snapshot, sizeBy: sizeByCalls })
  }),
  function ConnectionSankey({ data }) {
    if (!data || data.links.length === 0) {
      return null;
    }

    return (
      <DashboardTile title="Overview">
        <strong>
          Design, interaction and tooltip of this chart are not yet done. This is meant for demo purposes and to collect
          feedback.
        </strong>

        <p>
          <strong>
            There is going to be a switch here to switch being usage of counts vs. usage of latency as the data source
            for the Sankey link sizing.
          </strong>
        </p>

        <div style={{ height: '200px' }}>
          <ResponsiveSankey
            data={data}
            align="center"
            colors="d320"
            margin={{
              top: 10,
              right: 0,
              bottom: 10,
              left: 0
            }}
            nodeOpacity={0.6}
            nodeHoverOpacity={1}
            nodeWidth={16}
            nodePaddingX={4}
            nodePaddingY={12}
            nodeBorderWidth={0}
            nodeBorderColor="inherit:darker(0.4)"
            colorBy={nodeColorBy}
            linkOpacity={0.4}
            linkHoverOpacity={0.6}
            linkHoverOthersOpacity={0.3}
            linkContract={0}
            linkColorBy={linkColorBy}
            enableLabels
            labelOrientation="horizontal"
            labelPadding={12}
            labelTextColor="inherit:darker(2.4)"
            labelPosition="inside"
            animate={false}
            isInteractive
            label={getNodeLabel}
          />
        </div>
      </DashboardTile>
    );
  }
);

function nodeColorBy(node) {
  return node.color;
}

function linkColorBy(link) {
  return link.color;
}

function getNodeLabel(node) {
  return node.label;
}
