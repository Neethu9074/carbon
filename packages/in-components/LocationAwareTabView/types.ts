/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result } from '@instana/types';

import { Location } from 'in-stores/navigation/types';
import { Nullish } from 'in-types';

export interface Tab<TabData, TabProps extends {}> {
  label: string;
  path: string;
  component: React.ComponentType<TabProps & { location: Location; data: TabData | Nullish }>;
  header?: React.FunctionComponent<TabHeaderProps<TabData, TabProps>>;
  icon?: string;
  postIcon?: string;
  isVisible?: (result: Result<TabData> | Nullish) => boolean;
  isDisabled?: (result: Result<TabData> | Nullish) => boolean;
  noBottomMargin?: boolean;
  noTopPadding?: boolean;
  stickToHeader?: boolean;
  stickToBottom?: boolean;
  isFullWidth?: boolean;
  hideTabLabelWhenAlone?: boolean;
  isInternal?: boolean;
  /**
   * optional react component to be rendered on top without wrapping and adding additional
   * padding of styling
   */
  topBanner?: React.FunctionComponent;
}

export interface TabHeaderProps<TabData, TabProps extends {}> {
  tab: Tab<TabData, TabProps>;
  result: Result<TabData> | Nullish;
  location: Location;
}
