/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Tab from 'in-new-components/InlineTabNavigation/Tab';

import locals from './InlineTabNavigation.mless';

export default function InlineTabNavigation({ tabList, activeTabIndex, onTabSelect, isDisabled = false }) {
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

InlineTabNavigation.propTypes = {
  activeTabIndex: PropTypes.number,
  isDisabled: PropTypes.bool,
  onTabSelect: PropTypes.func,
  tabList: PropTypes.array
};
