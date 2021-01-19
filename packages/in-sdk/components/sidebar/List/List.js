/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-disable react/no-multi-comp */
import React from 'react';

import locals from './List.mless';

export default function List({ children }) {
  return <ul className={locals.list}>{children}</ul>;
}

List.Item = function ListItem({ children, onClick }) {
  if (__DEV__ && onClick) {
    throw new Error(
      'Illegal and old usage of an onClick handler on the List component. ' +
        'Use in-sdk/components/sidebar/ClickableList instead!'
    );
  }

  return <li className={locals.item}>{children}</li>;
};
