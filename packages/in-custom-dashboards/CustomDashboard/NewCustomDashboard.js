import React, { useState } from 'react';

import { goToCustomDashboard, duplicationSourceIdUrlParameter } from 'in-custom-dashboards/navigation/url';
import CustomDashboardPresenter from 'in-custom-dashboards/CustomDashboard/CustomDashboardPresenter';
import { onLayoutChange, onRenameDashboard } from 'in-custom-dashboards/CustomDashboard/editor';
import { getDuplicationSource } from 'in-custom-dashboards/duplicationSupport';
import { addCustomDashboard } from 'in-custom-dashboards/api';
import withUrlState from 'in-hoc/withUrlState';
import { user } from 'in-stores/user';

export default withUrlState({
  bind: [duplicationSourceIdUrlParameter]
})(NewCustomDashboard);

function NewCustomDashboard({ sourceId }) {
  const duplicationSource = sourceId && getDuplicationSource(sourceId);
  const [config, setConfig] = useState({
    title: duplicationSource ? `Copy of ${duplicationSource.title}` : 'New dashboard',
    accessRules: [
      {
        accessType: 'READ_WRITE',
        relationType: 'USER',
        relatedId: user.id
      }
    ],
    widgets: duplicationSource ? duplicationSource.widgets : []
  });

  return (
    <CustomDashboardPresenter
      config={config}
      setConfig={setConfig}
      isEditing
      isDeletable
      isResizable
      isConfigurable
      isDraggable
      onLayoutChange={changes => onLayoutChange(config, setConfig, changes)}
      onSaveConfiguration={() => onSaveConfiguration(config)}
      showDuplicateDashboard={false}
      onRenameDashboard={() => onRenameDashboard(config, setConfig)}
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
