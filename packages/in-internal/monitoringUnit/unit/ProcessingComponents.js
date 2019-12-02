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
  components =
    components && components.filter(({ docker }) => docker.get('label') === `${tenant}-${unit}-${componentName}`);

  if (!components || components.length < 1) {
    return <LinkListItem label={componentName} />;
  }

  return (
    <>
      {components.map(({ dropwizardApplicationContainer, docker, process }, i) => (
        <LinkListItem
          key={i}
          label={
            components.length === 1
              ? componentName
              : `${componentName} (allocation ${process.getIn([
                  'data',
                  'env',
                  'NOMAD_ALLOC_INDEX'
                ])}, allocId ${docker.getIn(['data', 'Nomad', 'allocId'])})`
          }
          href$={getModifiedUrlStream(params => {
            params.pathname = '/physical/dashboard';
            params.query.snapshotId = dropwizardApplicationContainer.get('id');
          })}
        />
      ))}
    </>
  );
}
