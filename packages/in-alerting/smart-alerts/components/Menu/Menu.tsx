/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import { Typography } from '@instana/components';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { t } from 'in-i18n';

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
          <span className={locals.checkboxLabel} key={i}>
            <CheckboxFancy
              key={i}
              label={
                <Typography
                  variant={
                    itemSelected.type === item.type && itemSelected.subType === item.subType
                      ? 'body-bold'
                      : 'body-regular'
                  }
                  noMargin
                >
                  <span
                    className={classNames({
                      [locals.color700]: itemSelected.type !== item.type
                    })}
                  >
                    {item.name} {item.isBeta && <BetaBadge />}
                  </span>
                </Typography>
              }
              checked={itemSelected.type === item.type && itemSelected.subType === item.subType}
              onChange={() => {
                setItemSelected(item);
                onItemClick(item);
              }}
              asRadioButton
            />
          </span>
        ))}
      </ul>
    </nav>
  );
}

function validateInitialItemSelected(initialItemSelected: MenuItem, items: readonly MenuItem[]) {
  if (__DEV__) {
    invariant(
      items.find(item => item.type === initialItemSelected.type),
      t('in-alerting:smartAlerts.applications.blueprintConfig.variantMessage', { type: initialItemSelected.type })
    );
  }
}
