import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import Title from 'in-components/Title';

export default function DeploymentDetails() {
  return (
    <div>
      <Title title="Resource Details" dynamic={'SOMETHING'} />
      <BackButton label="Back to resource list" href$={getSubDashboardLink(`/deployments`)} />

      <DashboardTile>
        <DescriptionList>
          <DescriptionItem title="Resource Host">
            {'SOMETHING'}
          </DescriptionItem>
        </DescriptionList>
      </DashboardTile>
    </div>
  );
}
