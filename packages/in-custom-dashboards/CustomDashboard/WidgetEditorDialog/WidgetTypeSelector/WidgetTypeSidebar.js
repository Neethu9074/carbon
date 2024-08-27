/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SideNavigation, SideNavigationItem } from 'in-components/SideNavigation/SideNavigation';
import { enabledWidgets } from 'in-custom-dashboards/widgets';

import locals from './WidgetTypeSidebar.mless';

export default function WidgetTypeSidebar({ form, onChangeType }) {
  const selectedType = form.get('type').value;

  return (
    <SideNavigation>
      {' '}
      {enabledWidgets.map(({ type, label, isBeta }) => (
        <SideNavigationItem
          key={type}
          omitEmptyIcon
          label={<span className={locals.label}>{label}</span>}
          isActive={selectedType === type}
          onClick={() => onChangeType(type)}
          isBeta={isBeta}
        />
      ))}{' '}
    </SideNavigation>
  );
}
