/* eslint-disable no-console */

import React from 'react';

import Dropdown, { ItemList } from 'in-new-components/Dropdown';

export default {
  title: 'Molecules|Dropdown',
  component: Dropdown
};

export const standard = () => <Dropdown label="expand me" />;

export const withIcon = () => <Dropdown icon="lib_actions_settings" label="expand me" />;

export const itemList = () => <ItemList items={[{ label: 'item1' }, { label: 'item2' }]} onClick={console.log} />;
