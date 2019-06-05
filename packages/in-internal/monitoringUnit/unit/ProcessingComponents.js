import React from 'react';

import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ tenant, unit, timeConfig }) => ({
    components: getPhysicalStack({
      searchQuery: `entity.label:"${tenant}-${unit}-*" AND entity.selfType:docker`,
      timeConfig
    })
  }),
  function StanStatistics({ components, tenant, unit }) {
    return (
      <Card title="Processing Components">
        <LinkList>
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="appdata-processor" />
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="ap-legacy-converter" />
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="cashier" />
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="filler" />
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="issue-tracker" />
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="processor" />
          <DashboardLinkItem tenant={tenant} unit={unit} components={components} componentName="ui-backend" />
        </LinkList>
      </Card>
    );
  }
);

function DashboardLinkItem({ tenant, unit, componentName, components }) {
  const component =
    components && components.filter(({ docker }) => docker.get('label') === `${tenant}-${unit}-${componentName}`)[0];

  return (
    <LinkListItem
      label={componentName}
      href$={
        component &&
        getModifiedUrlStream(params => {
          params.pathname = '/physical/dashboard';
          params.query.snapshotId = component.dropwizardApplicationContainer.get('id');
        })
      }
    />
  );
}
