/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

// @ts-expect-error import ExpandableCard from 'in-components/ExpandableCard';
import ExpandableCard from 'in-components/ExpandableCard';

export default {
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
