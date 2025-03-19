/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { noop } from 'lodash';
import React from 'react';

import ConfigDialog, { ConfigDialogProps } from 'in-settings/components/ConfigDialog/ConfigDialog';

export default {
  component: ConfigDialog
};

export const ConfigDialogExample = (args: ConfigDialogProps<any>) => {
  return <ConfigDialog {...args} />;
};

ConfigDialogExample.args = {
  title: 'Dialog Title',
  messages: [],
  noHeader: true,
  noDivider: true,
  showSubSlide: false,
  onClickSave: noop,
  onClickCancel: noop,
  subSlideConfig: {
    title: 'Sub slide title',
    content: <h2>Sub slide</h2>
  },
  navItems: [
    {
      scrollId: '1-heading',
      label: 'Heading',
      title: 'Heading',
      valid: true,
      hidden: true,
      content: <h1>Heading</h1>
    },
    {
      scrollId: '2-section',
      label: 'Section',
      title: 'Section',
      valid: true,
      content: (
        <div>
          <h2>My Section</h2>
        </div>
      )
    }
  ]
};
