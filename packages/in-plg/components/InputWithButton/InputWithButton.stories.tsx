/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import InputWithButton from 'in-plg/components/InputWithButton/InputWithButton';

export default {
  component: InputWithButton,
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'large']
    }
  }
};

export const Copy = (args: { icon: string }) => <InputWithButton type="copy" {...args} />;

Copy.args = {
  icon: 'lib_actions_copy',
  displayContent: 'Lorem ipsum dolor',
  inputValue: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
  magna aliqua.`
};

export const Download = (args: { icon: string; href: string }) => (
  <InputWithButton type="download" inputValue="lorem-ipsum-dolor.exe" {...args} />
);

Download.args = {
  icon: 'lib_actions_download',
  href: 'https://www.ibm.com/design/language/static/642fb8e4995bf460a8604b59f5e5c135/3cbba/2306_51_IDL_gallery.png'
};
