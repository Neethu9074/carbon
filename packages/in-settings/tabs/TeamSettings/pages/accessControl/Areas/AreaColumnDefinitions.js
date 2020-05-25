import React from 'react';

import KeyValue from 'in-new-components/lists/KeyValue';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AreaColumnDefinitions.mless';

export const iconColumn = {
  width: '3rem',
  getContent({ item }) {
    return <SvgIcon className={locals.icon} type={item.icon} />;
  }
};

export const labelColumn = {
  getContent({ item }) {
    return <KeyValue label={item.type} customValue={item.label || 'Not available'} accentuated />;
  }
};
