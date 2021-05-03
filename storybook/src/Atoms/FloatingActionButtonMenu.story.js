/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import { Button } from '@instana/components';

import FloatingActionButtonPresenter from 'in-new-components/FloatingActionButton/FloatingActionButtonPresenter';
import FloatingActionButtonMenu from 'in-new-components/FloatingActionButton/FloatingActionButtonMenu';

export default {
  title: 'Atoms|Buttons/Floating Action Button Menu',
  component: FloatingActionButtonMenu
};

const onClick = action('click');

export const HideWhenEmpty = () => (
  <FloatingActionButtonPresenter floatingActionButtons={[<FloatingActionButtonMenu />]} />
);

export const OneItem = () => (
  <FloatingActionButtonPresenter
    floatingActionButtons={[
      <FloatingActionButtonMenu>
        <Button onClick={onClick} icon="lib_openclose_add" kind="primaryv2">
          Item
        </Button>
      </FloatingActionButtonMenu>
    ]}
  />
);

export const MultipleItems = () => {
  return (
    <FloatingActionButtonPresenter
      floatingActionButtons={[
        <FloatingActionButtonMenu>
          <Button onClick={onClick} icon="lib_openclose_add" kind="primaryv2">
            Item 1
          </Button>
          <Button onClick={onClick} icon="lib_openclose_add" kind="primaryv2">
            Item 2
          </Button>
          <Button onClick={onClick} icon="lib_openclose_add" kind="primaryv2">
            Item 3
          </Button>
        </FloatingActionButtonMenu>
      ]}
    />
  );
};
