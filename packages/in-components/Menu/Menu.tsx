/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import locals from './Menu.mless';

export interface MenuItem {
  type: string;
  subType?: string;
  name: string;
}
export interface MenuProps {
  addRightSeparator: boolean;
  items: MenuItem[] | readonly MenuItem[];
  onItemClick: (item: MenuItem) => any;
  initialItemSelected: MenuItem;
}

export default function Menu({ addRightSeparator = false, items, onItemClick, initialItemSelected }: MenuProps) {
  validateInitialItemSelected(initialItemSelected, items);

  const [itemSelected, setItemSelected] = useState(() => {
    return initialItemSelected;
  });

  return (
    <nav
      className={classNames({
        [locals.container]: true,
        [locals.rightSeparator]: addRightSeparator
      })}
    >
      <ul className={locals.list}>
        {items.map((item, i) => (
          <li
            key={i}
            className={classNames({
              [locals.item]: true,
              [locals.selected]: itemSelected.type === item.type && itemSelected.subType === item.subType
            })}
            onClick={() => {
              setItemSelected(item);
              onItemClick(item);
            }}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function validateInitialItemSelected(initialItemSelected: MenuItem, items: readonly MenuItem[]) {
  if (__DEV__) {
    invariant(
      items.find(item => item.type === initialItemSelected.type),
      `The given initialItemSelected with type "${initialItemSelected.type}" is not present in the list of items.`
    );
  }
}
