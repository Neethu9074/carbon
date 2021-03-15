/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { range } from 'lodash';
import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import Overlay from 'in-new-components/overlays/Overlay';
import { Row, Col } from 'in-new-components/layout/Grid';
import Button from 'in-new-components/Button';

export default {
  title: 'Templates|layout/Overlay',
  component: Overlay
};

export function OpenOnHover() {
  return (
    <div style={{ width: 'fit-content' }}>
      <Overlay content={ToggleOveraly} wrapper autoOpen props={{ x: 'foo', y: 'bar' }}>
        {({ toggle, refSetter }) => (
          <Button ref={refSetter} onClick={toggle}>
            hover here to toggle
          </Button>
        )}
      </Overlay>

      <OverlayPresenter />
    </div>
  );
}

export function OpenOnClick() {
  return (
    <div style={{ width: 'fit-content' }}>
      <Overlay content={ToggleOveraly} wrapper autoOpen={false} props={{ x: 'foo', y: 'bar' }}>
        {({ toggle, refSetter }) => (
          <Button ref={refSetter} onClick={toggle}>
            click here to toggle
          </Button>
        )}
      </Overlay>

      <OverlayPresenter />
    </div>
  );
}

export function AutoPositioning() {
  return (
    <>
      {range(0, 6).map(y => (
        <Row key={y}>
          {range(0, 12).map(x => (
            <Col xs={1} key={x}>
              <ToggleOverlay x={x} y={y} />
            </Col>
          ))}
        </Row>
      ))}

      <OverlayPresenter />
    </>
  );
}

function ToggleOverlay({ x, y }) {
  const autoOpen = x % 2 === 0 && y % 2 === 0;
  return (
    <Overlay
      content={ToggleOveraly}
      props={{ x, y }}
      wrapper={autoOpen}
      autoOpen={autoOpen}
      kind={autoOpen ? 'tooltip' : 'popover'}
    >
      {({ isOpen, toggle }) => (
        <div
          style={{
            background: isOpen ? 'green' : autoOpen ? 'blue' : 'gray',
            width: '100%',
            height: '50px',
            fontWeight: 'bold'
          }}
          onClick={toggle}
        >
          {x},{y}
        </div>
      )}
    </Overlay>
  );
}

function ToggleOveraly({ x, y }) {
  return (
    <div style={{ fontWeight: 'bold' }}>
      {x},{y}
    </div>
  );
}
