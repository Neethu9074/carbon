import React from 'react';

import ApplicationMapTootlip from 'in-new-components/ApplicationMap/components/Tooltips/ApplicationMapTootlip';
import Header from 'in-new-components/ApplicationMap/components/Tooltips/ServiceInformation/Header';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';

export default function ErroneousServiceInformation({ service, errors }) {
  return (
    <ApplicationMapTootlip
      renderHeader={() => <Header service={service} />}
      renderContent={() => <ErroneousResultPresenter errors={errors} />}
    />
  );
}
