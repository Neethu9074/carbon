import React from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import { compareIgnoreCase } from 'in-services/util/string';
import widgets from 'in-custom-dashboards/widgets';

export default function WidgetTypeSelector({ form, onChangeType }) {
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
            label={widgets[type].label}
            isActive={selectedType === type}
            onClick={() => onChangeType(type)}
          />
        ))}{' '}
    </SideNavigation>
  );
}
