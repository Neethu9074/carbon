/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import SelectedBlueprintPresenter from 'in-components/BlueprintFormMultistep/SelectedBlueprintPresenter';

export default {
  component: SelectedBlueprintPresenter
};

export const FullFeatured = {
  args: {
    title: 'Title',
    description: 'Description',
    children: <p>Lorem ipsum</p>,
    isBeta: true
  }
};
