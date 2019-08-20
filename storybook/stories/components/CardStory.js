import { storiesOf } from '@storybook/react';
import React from 'react';

import LearnMoreCard from 'in-new-components/Card/LearnMoreCard';
import { Row, Col } from 'in-new-components/layout/Grid';
import Input from 'in-components/form/Input';
import Card from 'in-new-components/Card';
import Root from '../_helpers/Root';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate iure, possimus cumque quis. Ducimus nisi aspernatur, aperiam eius tempora facilis, architecto id ullam esse repellat, fugit sint optio dolores corporis.';
const exampleCard = <Card title="A Card">{lorem}</Card>;

storiesOf('Components/Card', module)
  .add('Single Card', () => <SingleCard />)
  .add('With additional header content', () => <WithAdditionalHeaderContent />)
  .add('Cards in a Grid', () => <GridCard />)
  .add('Learn More', () => <LearnMoreCardStory />);

function SingleCard() {
  return <Root>{exampleCard}</Root>;
}

function WithAdditionalHeaderContent() {
  const searchField = <Input placeholder="Waaazzz uuuuppp?" />;
  return (
    <Root>
      <Card title="A Card" header={searchField} withoutPadding>
        {lorem}
      </Card>
    </Root>
  );
}

function GridCard() {
  return (
    <Root>
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
    </Root>
  );
}

function LearnMoreCardStory() {
  return (
    <Root>
      <LearnMoreCard
        title="Racing Drone Cameras"
        explanation="Racing drones typically carry two cameras. An analog low latency one is used during the flight. It typically has a bad video quality, but great contrast and good behavior in mixed lighting conditions. Its video is streamed to pilots' video gear. A high latency digital camera is added for high quality video recordings."
        learnMoreHref="https://www.youtube.com/watch?v=0DEIipqetH0&list=PL3qKHT9eHYJapDsT-bLmWHGpqYFNBq3c7&index=15&t=0s"
        learnMoreLabel="See a racing drone fly"
      />
    </Root>
  );
}
