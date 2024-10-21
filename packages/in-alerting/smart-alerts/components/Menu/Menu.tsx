/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import invariant from 'invariant';

import { PreviewPill, RadioButton, Stack } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

import locals from './Menu.mless';

export interface MenuItem {
  type: string;
  subType?: string;
  name: string;
  isBeta?: boolean;
}

type Direction = 'vertical' | 'horizontal' | undefined;

export interface MenuProps<T extends MenuItem> {
  items: T[] | readonly T[];
  onItemClick: (item: T) => any;
  initialItemSelected: MenuItem;
  direction: Direction;
  addRightSeparator: boolean;
}

export default function Menu<T extends MenuItem>({
  items,
  onItemClick,
  initialItemSelected,
  direction,
  addRightSeparator
}: MenuProps<T>) {
  validateInitialItemSelected(initialItemSelected, items);

  const [itemSelected, setItemSelected] = useState(() => {
    return initialItemSelected;
  });

  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={classNames({
        [locals.verticalContainer]: !isHorizontal,
        [locals.horizontalContainer]: isHorizontal,
        [locals.rightSeparator]: addRightSeparator
      })}
    >
      <Stack direction={direction} {...(isHorizontal ? { gap: 'large' } : {})}>
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
                      {item.name} {item.isBeta && <PreviewPill />}
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
      </Stack>
    </div>
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
