/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';

export default {
  title: 'Atoms|Buttons/Floating Action Button',
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
  <FloatingActionButton iconType="lib_alerts_create" onClick={onClick}>
    Button Rounded with icon
  </FloatingActionButton>
);

export const AllKinds = () => (
  <>
    <FloatingActionButton iconType="lib_alerts_create" onClick={onClick} kind={'primaryv2'}>
      Primaryv2
    </FloatingActionButton>
    <FloatingActionButton iconType="lib_alerts_create" onClick={onClick} kind={'action'}>
      Action
    </FloatingActionButton>
  </>
);
