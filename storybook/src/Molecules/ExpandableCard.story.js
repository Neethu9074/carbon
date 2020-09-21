import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';
import Button from 'in-new-components/Button';

export default {
  title: 'Molecules|Cards/ExpandableCard',
  component: ExpandableCard
};

export const standard = () => (
  <ExpandableCard title="ExpandableCard Title">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat beatae doloremque sit odit officia consectetur
    neque aut magnam sint? Eos laborum magni quidem debitis sequi voluptates, magnam fuga incidunt sed?
  </ExpandableCard>
);

export const withHeaderAction = () => (
  <ExpandableCard title="ExpandableCard Title" header={<Button>Action</Button>}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit minima dolore, veritatis quia possimus accusamus
    expedita obcaecati eveniet voluptates soluta beatae repellendus libero aliquid fugit maxime, reiciendis laudantium.
    Maxime, officia.
  </ExpandableCard>
);

export const notFramed = () => (
  <ExpandableCard title="ExpandableCard Title" framed={false}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit minima dolore, veritatis quia possimus accusamus
    expedita obcaecati eveniet voluptates soluta beatae repellendus libero aliquid fugit maxime, reiciendis laudantium.
    Maxime, officia.
  </ExpandableCard>
);
