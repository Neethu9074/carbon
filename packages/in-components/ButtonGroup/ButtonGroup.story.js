/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ButtonGroup from 'in-components/ButtonGroup';

export default {
  title: 'Atoms|ButtonGroup',
  component: ButtonGroup
};

export function Default() {
  return (
    <>
      <ButtonGroup buttonPropsList={[{ text: 'Button 1', key: '1' }]} activeKey="1" />
      <br />
      <ButtonGroup
        buttonPropsList={[
          { text: 'Button 1', key: '1' },
          { text: 'Button 2', key: '2' }
        ]}
        activeKey="2"
      />
      <br />
      <ButtonGroup
        buttonPropsList={[
          { text: 'Button 1', key: '1' },
          { text: 'Button 2', key: '2' },
          { text: 'Button 3', key: '3' },
          { text: 'Button 4', key: '4' }
        ]}
        activeKey="2"
      />
    </>
  );
}

export function Segmented() {
  return (
    <>
      <ButtonGroup segmented buttonPropsList={[{ text: 'Button 1', key: '1' }]} activeKey="1" />
      <br />
      <ButtonGroup
        segmented
        buttonPropsList={[
          { text: 'Button 1', key: '1' },
          { text: 'Button 2', key: '2' }
        ]}
        activeKey="2"
      />
      <br />
      <ButtonGroup
        segmented
        buttonPropsList={[
          { text: 'Button 1', key: '1' },
          { text: 'Button 2', key: '2' },
          { text: 'Button 3', key: '3' },
          { text: 'Button 4', key: '4' }
        ]}
        activeKey="2"
      />
    </>
  );
}
