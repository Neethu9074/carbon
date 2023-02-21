/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Tab from 'in-components/InlineTabNavigation/Tab';

import locals from './InlineTabNavigation.mless';

interface InlineTabNavigationProps {
  activeTabIndex: number;
  isDisabled: boolean;
  onTabSelect: (...args: any[]) => any;
  tabList: any[];
}

export default function InlineTabNavigation({
  tabList,
  activeTabIndex,
  onTabSelect,
  isDisabled = false
}: InlineTabNavigationProps) {
  return (
    <ul className={locals.wrapper}>
      {tabList.map((tab, i) => (
        <Tab
          key={i}
          index={i}
          isActive={activeTabIndex === i}
          isDisabled={isDisabled || tab.disabled}
          onTabSelect={onTabSelect}
          withoutBottomBorder={tabList.length === 1 && activeTabIndex !== 0}
          {...tab}
        />
      ))}
    </ul>
  );
}
