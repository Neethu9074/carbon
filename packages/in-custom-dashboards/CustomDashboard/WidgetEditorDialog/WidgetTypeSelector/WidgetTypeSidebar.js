/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import { compareIgnoreCase } from 'in-services/util/string';
import widgets from 'in-custom-dashboards/widgets';
import Pill from 'in-new-components/Pill';

import locals from './WidgetTypeSidebar.mless';

export default function WidgetTypeSidebar({ form, onChangeType }) {
  const selectedType = form.get('type').value;

  return (
    <SideNavigation>
      {' '}
      {Object.keys(widgets)
        .filter(type => widgets[type].enabled)
        .sort((a, b) => compareIgnoreCase(widgets[a].label, widgets[b].label))
        .map(type => (
          <SideNavigationItem
            key={type}
            omitEmptyIcon
            label={
              <span className={locals.label}>
                {widgets[type].label}

                {widgets[type].badge?.content && <Pill kind="primary">{widgets[type].badge.content}</Pill>}
              </span>
            }
            isActive={selectedType === type}
            onClick={() => onChangeType(type)}
          />
        ))}{' '}
    </SideNavigation>
  );
}
