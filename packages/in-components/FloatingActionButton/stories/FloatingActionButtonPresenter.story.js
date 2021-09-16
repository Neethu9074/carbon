/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import FloatingActionButtonPresenter from 'in-components/FloatingActionButton/FloatingActionButtonPresenter';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';

export default {
  title: 'Atoms|Buttons/Floating Action Button Presenter',
  component: FloatingActionButtonPresenter
};

const onClick = action('click');

export const Default = () => {
  return (
    <FloatingActionButtonPresenter
      floatingActionButtons={[
        <FloatingActionButton onClick={onClick}>Button Rounded</FloatingActionButton>,
        <FloatingActionButton onClick={onClick}>Button Rounded</FloatingActionButton>,
        <FloatingActionButton onClick={onClick}>Button Rounded</FloatingActionButton>
      ]}
    />
  );
};
