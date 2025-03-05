/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import ConjunctionTagSelectorOverlayImp from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import tagCatalogExampleJson from 'in-components/TagSelectorOverlay/stories/tagCatalogExample';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';

export default {
  component: TagSelectorOverlay
};

export const Default = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <TagSelectorOverlay
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
        tagCatalog={tagCatalogExampleJson}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'default'
};

export const ConjunctionTagSelectorOverlay = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <ConjunctionTagSelectorOverlayImp
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
        tagCatalog={tagCatalogExampleJson}
      />
    </PermanentlyVisibleOverlay>
  ),

  name: 'ConjunctionTagSelectorOverlay'
};
