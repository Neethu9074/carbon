/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import FeatureFeedback from 'in-components/FeatureFeedback/FeatureFeedback';

export default {
  component: FeatureFeedback,
  args: {
    href: 'https://instana.io'
  }
};

export const Default = {};

export const CustomText = {
  args: {
    labelText: 'custom label text'
  }
};

export const CustomStyles = {
  args: {
    styles: {
      background: 'yellow'
    }
  }
};
