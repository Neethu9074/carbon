import { storiesOf } from '@storybook/react';
import React from 'react';

import {Row, Col} from 'in-new-components/layout/Grid';
import Card from 'in-new-components/Card';
import Root from '../_helpers/Root';

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate iure, possimus cumque quis. Ducimus nisi aspernatur, aperiam eius tempora facilis, architecto id ullam esse repellat, fugit sint optio dolores corporis.';
const exampleCard = (
  <Card title="Card in a card">
    {lorem}
  </Card>
);

storiesOf('newComponents/Card', module)
  .add('Single Card', () => <SingleCard />)
  .add('Cards in a Grid', () => <GridCard />);

function SingleCard() {
  return (
    <Root>
      {exampleCard}
    </Root>
  );
}
function GridCard() {
  return (
    <Root>
      <div>
        <Row>
          <Col xs={6}>
            {exampleCard}
          </Col>
          <Col xs={6}>
            {exampleCard}
          </Col>
        </Row>
        <Row>
          <Col xs={4}>
            {exampleCard}
          </Col>
          <Col xs={4}>
            {exampleCard}
          </Col>
          <Col xs={4}>
            {exampleCard}
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            {exampleCard}
          </Col>
          <Col xs={3}>
            {exampleCard}
          </Col>
          <Col xs={3}>
            {exampleCard}
          </Col>
          <Col xs={3}>
            {exampleCard}
          </Col>
        </Row>
      </div>
    </Root>
  );
}
