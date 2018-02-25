import { storiesOf } from '@storybook/react';
import { range } from 'lodash';
import React from 'react';

import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';
import Overlay from 'in-new-components/overlays/Overlay';
import { Row, Col } from 'in-new-components/layout/Grid';
import Root from '../../_helpers/Root';

storiesOf('newComponents/overlays/Overlay', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
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
    </Root>
  );
}

function ToggleOverlay({ x, y }) {
  const autoOpen = x % 2 === 0 && y % 2 === 0;
  return (
    <Overlay content={ToggleOveraly} props={{x, y}} wrapper={autoOpen} autoOpen={autoOpen} kind={autoOpen ? 'tooltip' : 'popover'}>
      {({ isOpen, toggle }) => (
        <div
          style={{
            background: isOpen ? 'green' : (autoOpen ? 'blue' : 'gray'),
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

function ToggleOveraly({x, y}) {
  return (
    <div style={{fontWeight: 'bold'}}>
      {x},{y}
    </div>
  );
}
