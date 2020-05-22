/* eslint-disable no-console */

import React from 'react';

import Dropdown from 'in-new-components/Dropdown';

export default {
  title: 'Molecules|Dropdown',
  component: Dropdown
};

export const standard = () => <Dropdown label="expand me" items={[{ label: 'Foobar' }]} />;

export const withIcon = () => <Dropdown icon="lib_actions_settings" label="expand me" items={[{ label: 'Foobar' }]} />;

export const asSimpleDropdown = () => (
  <Dropdown icon="lib_actions_settings" label="expand me" asSimpleDropdown items={[{ label: 'Foobar' }]} />
);
