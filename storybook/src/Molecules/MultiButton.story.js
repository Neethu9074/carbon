/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import MultiButton from 'in-components/MultiButton';

export default {
  title: 'Molecules|MultiButton',
  component: MultiButton
};
const buttons = [
  <Button kind="secondary">Test</Button>,
  <Button kind="secondary">Tes2t</Button>,
  <Button kind="secondary">Test3</Button>,
  <Button kind="secondary">Test4</Button>
];
export const standard = () => <MultiButton label="MultiButton" buttons={buttons} />;
