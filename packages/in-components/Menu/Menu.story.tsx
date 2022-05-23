/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import Menu from 'in-components/Menu/Menu';

export default {
  component: Menu
};

const menu1 = { type: 'type1', name: 'name1' };
const menu2 = { type: 'type2', name: 'name2', isBeta: true };
const menu3 = { type: 'type3', name: 'name3', isBeta: true };
const entries = [menu1, menu2, menu3];

export const MenuDefault = {
  args: {
    items: entries,
    initialItemSelected: menu1
  },
  argTypes: {
    onItemClick: {
      action: 'item clicked'
    }
  }
};

export const MenuWithSeperator = {
  args: {
    ...MenuDefault.args,
    addRightSeparator: true
  }
};
