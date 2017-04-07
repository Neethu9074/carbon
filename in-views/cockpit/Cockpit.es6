import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import { Row, Col } from 'in-components/Grid/Grid';
import Tile from 'in-views/cockpit/Tile';

import 'in-views/cockpit/Cockpit.less';

const block = 'in-cockpit';

export default function Cockpit() {
  return (
    <FullscreenOverlayView className={block} overlayTimeline>
      <Row>
        <Col cols={4}>
          <Tile header={'Infrastructure'} />
        </Col>
        <Col cols={4}>
          <Tile header={'Application'} />
        </Col>
        <Col cols={4}>
          <Tile header={'Events'} />
        </Col>
      </Row>
      <Row>
        <Col cols={6}>
          <Tile header={'Traces'} />
        </Col>
        <Col cols={6}>
          <Tile header={'Spans'} />
        </Col>
      </Row>
    </FullscreenOverlayView>
  );
}
