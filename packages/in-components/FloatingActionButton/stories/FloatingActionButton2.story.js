/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';

export default {
  component: FloatingActionButton
};

const onClick = action('click');

export const Standard = () => {
  return <FloatingActionButton onClick={onClick}>Button</FloatingActionButton>;
};

export const WithShadow = () => {
  return (
    <FloatingActionButton onClick={onClick} withBoxShadow>
      Button
    </FloatingActionButton>
  );
};

export const WithIconAndText = () => (
  <FloatingActionButton icon="lib_alerts_create" onClick={onClick}>
    Button Rounded with icon
  </FloatingActionButton>
);

export const AllKinds = () => (
  <>
    <FloatingActionButton icon="lib_alerts_create" onClick={onClick} kind={'primaryv2'}>
      Primaryv2
    </FloatingActionButton>
    <FloatingActionButton icon="lib_alerts_create" onClick={onClick} kind={'action'}>
      Action
    </FloatingActionButton>
  </>
);
