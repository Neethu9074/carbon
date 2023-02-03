/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import BetaBadge from 'in-components/BetaBadge/BetaBadge';

import locals from './Menu.mless';

export interface MenuItem {
  type: string;
  subType?: string;
  name: string;
  isBeta?: boolean;
}

export interface MenuProps<T extends MenuItem> {
  addRightSeparator?: boolean;
  items: T[] | readonly T[];
  onItemClick: (item: T) => any;
  initialItemSelected: MenuItem;
}

export default function Menu<T extends MenuItem>({
  addRightSeparator = false,
  items,
  onItemClick,
  initialItemSelected
}: MenuProps<T>) {
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
            {item.isBeta && <BetaBadge />}
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
