/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren } from 'react';

import { Ul } from '@instana/components';

import locals from './TabSelect.mless';

export interface TabSelectMenuProps {}

export function TabSelectMenu({ children }: PropsWithChildren<TabSelectMenuProps>) {
  return (
    <nav className={locals.menu}>
      <Ul className={locals.menuList}>{children}</Ul>
    </nav>
  );
}
