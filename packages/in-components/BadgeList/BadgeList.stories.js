/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';

export default {
  component: BadgeList
};

export const Default = () => {
  return <BadgeList type="Badge" getColor={() => 'purple'} />;
};

export const List = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 2'];
  return <BadgeList types={types} getColor={() => 'purple'} />;
};
export const LimitedList = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4', 'Badge 5', 'Badge 6'];
  return <BadgeList types={types} getColor={() => 'purple'} limit={3} />;
};
export const DifferentColors = () => {
  const types = [
    'red',
    'magenta',
    'purple',
    'blue',
    'cyan',
    'teal',
    'green',
    'gray',
    'cool-gray',
    'warm-gray',
    'high-contrast',
    'outline'
  ];

  function getColor(type) {
    return type;
  }

  return <BadgeList types={types} getColor={getColor} />;
};
