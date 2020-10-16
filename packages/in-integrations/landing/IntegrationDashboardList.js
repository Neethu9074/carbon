import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import SnapshotLink from 'in-components/tables/ServerTable/components/SnapshotLink';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { Ul, Li } from 'in-new-components/lists/List';
import PluginIcon from 'in-components/PluginIcon';

import locals from './IntegrationDashboardList.mless';

export default function IntegrationDashboardList({ entities, query }) {
  if (!entities) {
    return <LoadingIndicator text="Loading Data" />;
  }

  if (entities.length === 0) {
    const explanation = query && query.length > 0 ? `No entities found for ${query}` : `No entities found`;
    return (
      <CenterAlignmentColumn>
        <EntityPageMainNotification
          icon="lib_actions_search"
          title="No matching entities found"
          explanation={explanation}
        />
      </CenterAlignmentColumn>
    );
  }

  return (
    <Ul>
      {entities.map(entity => {
        return (
          <Li key={entity.id}>
            <div className={locals.itemWrapper}>
              <PluginIcon className={locals.simplePluginIcon} plugin={entity.plugin} />
              <SnapshotLink key={entity.id} snapshotPreview={entity}>
                {entity.label}
              </SnapshotLink>
            </div>
          </Li>
        );
      })}
    </Ul>
  );
}
