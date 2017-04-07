import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { Row, Col } from 'in-components/Grid/Grid';
import Metric from 'in-views/cockpit/Metric';
import Tile from 'in-views/cockpit/Tile';

import 'in-views/cockpit/Cockpit.less';

const block = 'in-cockpit';

export default function Cockpit() {
  return (
    <FullscreenOverlayView className={block} overlayTimeline>
      <Row>
        <Col cols={4}>
          <Tile header="Infrastructure">
            <Metric metric="#entities" />
          </Tile>
        </Col>
        <Col cols={4}>
          <Tile header={'Application'}>
            <Metric metric="#entities" />
          </Tile>
        </Col>
        <Col cols={4}>
          <Tile header={'Events'}>
            <Metric metric="#open events" />
          </Tile>
        </Col>
      </Row>
      <Row>
        <Col cols={6}>
          <Tile header={'Traces'}>
            <Metric metric="#traces" />
          </Tile>
        </Col>
        <Col cols={6}>
          <Tile header={'Spans'}>
            <Metric metric="#spans" />
          </Tile>
        </Col>
      </Row>
    </FullscreenOverlayView>
  );
}
