import React from 'react';

import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getIntegrationsByIds } from 'in-services/api/integrations';
import { emptyList } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const connectedIntegrations = props.config.get('integrationIds', emptyList).toArray();

    return {
      integrations: getIntegrationsByIds(connectedIntegrations)
    };
  },
  function AlertingConfigurationDetails({ config, integrations = [] }) {
    if (!config) {
      return null;
    }

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title="Query">{config.getIn(['eventFilteringConfiguration', 'query'])}</DescriptionItem>
          <DescriptionItem title="Event Type">
            {config.getIn(['eventFilteringConfiguration', 'eventTypes']).map(type => <div key={type}>{type}</div>)}
          </DescriptionItem>
        </DescriptionList>
        <DescriptionList>
          <DescriptionItem title="Integrations">
            {integrations.map(integration => (
              <div key={integration.get('id')}>{fullyQualified[integration.get('kind')].label}</div>
            ))}
          </DescriptionItem>
        </DescriptionList>
      </div>
    );
  }
);
