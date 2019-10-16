import { storiesOf } from '@storybook/react';
import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';
import { Row, Col } from 'in-new-components/layout/Grid';
import Input from 'in-components/form/Input';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate iure, possimus cumque quis. Ducimus nisi aspernatur, aperiam eius tempora facilis, architecto id ullam esse repellat, fugit sint optio dolores corporis.';
const exampleCard = <ExpandableCard title="A Card">{lorem}</ExpandableCard>;

export default {
  title: 'Components/ExpandableCard',
  component: ExpandableCard
};

storiesOf('Components/ExpandableCard', module)
  .addParameters({ component: ExpandableCard })
  .add('Single Card', () => <SingleCard />)
  .add('With additional header content', () => <WithAdditionalHeaderContent />)
  .add('Cards in a Grid', () => <GridCard />);

function SingleCard() {
  return <>{exampleCard}</>;
}

function WithAdditionalHeaderContent() {
  const searchField = <Input placeholder="Waaazzz uuuuppp?" />;
  return (
    <ExpandableCard title="A Card" header={searchField} withoutPadding>
      {lorem}
    </ExpandableCard>
  );
}

function GridCard() {
  return (
    <>
      <div>
        <Row>
          <Col xs={6}>{exampleCard}</Col>
          <Col xs={6}>{exampleCard}</Col>
        </Row>
        <Row>
          <Col xs={4}>{exampleCard}</Col>
          <Col xs={4}>{exampleCard}</Col>
          <Col xs={4}>{exampleCard}</Col>
        </Row>
        <Row>
          <Col xs={3}>{exampleCard}</Col>
          <Col xs={3}>{exampleCard}</Col>
          <Col xs={3}>{exampleCard}</Col>
          <Col xs={3}>{exampleCard}</Col>
        </Row>
      </div>
    </>
  );
}
