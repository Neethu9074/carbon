import React from 'react';

import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { getIntegrationsByIds } from 'in-api/integrations';
import { emptyList } from 'in-services/fixedImmutables';
import { just } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';
import { validate } from 'in-api/search';

export default connectTo(
  props => {
    const connectedIntegrations = props.config.get('integrationIds', emptyList).toArray();

    return {
      integrations: getIntegrationsByIds(connectedIntegrations),
      validFlag: twoZeroModeEnabled ? validate(query, true).map(response -> response.body.valid) : just(true)
    };
  },
  function AlertingConfigurationDetails({ config, integrations = [], validFlag }) {
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
