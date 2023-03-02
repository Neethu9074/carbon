/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MultilineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';

export default {
  component: MultilineToolTipIcon,
  parameters: {
    chromatic: { disable: true }
  }
};

export const MultiLineToolTipWithIconWithSingleComment = () => {
  return <MultilineToolTipIcon lines={['Hello']} />;
};

export const MultiLineToolTipWithIconWithMultiComment = () => {
  return <MultilineToolTipIcon lines={['Hello', 'World']} />;
};
