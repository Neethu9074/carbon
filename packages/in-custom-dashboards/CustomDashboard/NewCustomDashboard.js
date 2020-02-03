import React, { useState } from 'react';

import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import { onLayoutChange, onAddNewWidget, onEditWidget } from 'in-custom-dashboards/CustomDashboard/editor';
import { goToCustomDashboard } from 'in-custom-dashboards/navigation/url';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import { user } from 'in-stores/user';

export default function NewCustomDashboard() {
  const [config, setConfig] = useState({
    title: 'New dashboard',
    accessRules: [
      {
        accessType: 'READ_WRITE',
        relationType: 'USER',
        relatedId: user.id
      }
    ],
    widgets: []
  });

  return (
    <CustomDashboardPresenter
      config={config}
      isEditing
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onAddNewWidget={() => onAddNewWidget(config, setConfig)}
      onEditWidget={widget => onEditWidget(config, setConfig, widget)}
      onSaveConfiguration={() => onSaveConfiguration(config)}
    />
  );
}

function onSaveConfiguration(config) {
  addCustomDashboard(config).subscribe(result => {
    if (result.progress.loading) {
      return;
    }

    if (result.errors.length > 0) {
      // TODO improve error case
      alert('Saving failed');
      return;
    }

    goToCustomDashboard(result.data.id);
  });
}
