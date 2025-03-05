/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { stopPropagation } from 'in-services/util/function';

export default {
  component: MoreMenu
};

export const Default = {
  render: () => (
    <MoreMenu>
      <MoreMenuButton icon="lib_actions_maximize">TV Mode</MoreMenuButton>
      <MoreMenuButton icon="lib_views_grid">Make Homepage</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_edit">Edit Name</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_copy">Duplicate</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_delete">Delete</MoreMenuButton>
    </MoreMenu>
  ),

  name: 'default'
};

export const WithCustomInteractiveElementToOpenTheMenu = {
  render: () => (
    <MoreMenu
      renderInteractiveElement={({ ref, toggle }) => (
        <Button
          kind="action"
          onClick={e => {
            stopPropagation(e);
            toggle();
          }}
          ref={ref}
        >
          Trigger action
        </Button>
      )}
    >
      <MoreMenuButton icon="lib_actions_maximize">TV Mode</MoreMenuButton>
      <MoreMenuButton icon="lib_views_grid">Make Homepage</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_edit">Edit Name</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_copy">Duplicate</MoreMenuButton>
      <MoreMenuButton icon="lib_actions_delete">Delete</MoreMenuButton>
    </MoreMenu>
  ),

  name: 'with custom interactive element to open the menu'
};
