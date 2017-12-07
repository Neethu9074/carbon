import React from 'react';

import FullBodyHeightWrapper from 'in-components/FullBodyHeightWrapper';
import EventMetrics from 'in-views/cockpit/components/EventMetrics';
import TraceMetrics from 'in-views/cockpit/components/TraceMetrics';
import SpanMetrics from 'in-views/cockpit/components/SpanMetrics';
import PluginUsage from 'in-views/cockpit/components/PluginUsage';
import Entities from 'in-views/cockpit/components/Entities';
import Overall from 'in-views/cockpit/components/Overall';
import Tile from 'in-views/cockpit/components/Tile';
import { Row, Col } from 'in-components/Grid/Grid';
import Title from 'in-components/Title';

import './Cockpit.less';

const block = 'in-cockpit';

const isLogicalPlugin = pluginId => /service|logical/i.test(pluginId);
const isPhysicalPlugin = pluginId => !isLogicalPlugin(pluginId);

export default function Cockpit() {
  return (
    <FullBodyHeightWrapper>
      <div className={block}>
        <Title title="Cockpit" />
        <Row>
          <Col cols={6}>
            <Tile header="Entities">
              <Entities />
            </Tile>
          </Col>
          <Col cols={6}>
            <Tile header="Overall">
              <Overall />
            </Tile>
          </Col>
        </Row>
        <Row>
          <Col cols={4}>
            <Tile header="Infrastructure">
              <PluginUsage pluginIdFilter={isPhysicalPlugin} />
            </Tile>
          </Col>
          <Col cols={4}>
            <Tile header="Application">
              <PluginUsage pluginIdFilter={isLogicalPlugin} />
            </Tile>
          </Col>
          <Col cols={4}>
            <Tile header="Events">
              <EventMetrics />
            </Tile>
          </Col>
        </Row>
        <Row>
          <Col cols={6}>
            <Tile header="Traces">
              <TraceMetrics />
            </Tile>
          </Col>
          <Col cols={6}>
            <Tile header="Spans">
              <SpanMetrics />
            </Tile>
          </Col>
        </Row>
      </div>
    </FullBodyHeightWrapper>
  );
}
