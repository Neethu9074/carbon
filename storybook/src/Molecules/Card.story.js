/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Button from 'in-new-components/Button';
import { Card } from '@instana/components';

export default {
  title: 'Molecules|Cards/Card',
  component: Card
};

export const standard = () => (
  <Card title="Card Title">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat beatae doloremque sit odit officia consectetur
    neque aut magnam sint? Eos laborum magni quidem debitis sequi voluptates, magnam fuga incidunt sed?
  </Card>
);

export const withSubtext = () => (
  <Card title="Card Title" titleSubText="This is the subtext">
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugiat beatae doloremque sit odit officia consectetur
    neque aut magnam sint? Eos laborum magni quidem debitis sequi voluptates, magnam fuga incidunt sed?
  </Card>
);

export const withHeaderAction = () => (
  <Card title="Card Title" header={<Button>Action</Button>}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit minima dolore, veritatis quia possimus accusamus
    expedita obcaecati eveniet voluptates soluta beatae repellendus libero aliquid fugit maxime, reiciendis laudantium.
    Maxime, officia.
  </Card>
);

export const notFramed = () => (
  <Card title="Card Title" framed={false}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit minima dolore, veritatis quia possimus accusamus
    expedita obcaecati eveniet voluptates soluta beatae repellendus libero aliquid fugit maxime, reiciendis laudantium.
    Maxime, officia.
  </Card>
);

export const withDarkFrame = () => (
  <Card title="Dark Frame" darkFrame>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit minima dolore, veritatis quia possimus accusamus
    expedita obcaecati eveniet voluptates soluta beatae repellendus libero aliquid fugit maxime, reiciendis laudantium.
    Maxime, officia.
  </Card>
);
