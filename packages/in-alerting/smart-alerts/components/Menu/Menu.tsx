/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import { RadioButton } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';
import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';
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
            <RadioButton
              key={i}
              label={
                <AlertTypography
                  variant={
                    itemSelected.type === item.type && itemSelected.subType === item.subType
                      ? 'body-bold'
                      : 'body-regular'
                  }
                  color={itemSelected.type !== item.type ? 'color700' : ''}
                  content={
                    <>
                      {item.name} {item.isBeta && <PreviewBadge />}
                    </>
                  }
                  noMargin
                />
              }
              checked={itemSelected.type === item.type && itemSelected.subType === item.subType}
              onChange={() => {
                setItemSelected(item);
                onItemClick(item);
              }}
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
