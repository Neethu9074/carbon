import React from 'react';

import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getIntegrationsByIds } from 'in-api/integrations';
import { emptyList } from 'in-services/fixedImmutables';
import connectTo from 'in-hoc/connectTo';

import './AlertingConfigurationDetails.less';

const block = 'in-alerting-config-details';

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
            {config.getIn(['eventFilteringConfiguration', 'eventTypes']).map(type => (
              <div key={type}>{type}</div>
            ))}
          </DescriptionItem>
          {integrations.length > 0 && (
            <DescriptionItem title="Integrations">
              {integrations.map(integration => (
                <ul key={integration.get('id')} className={`${block}__ul`}>
                  <IntegrationListItem integrationKind={integration.get('kind')} />
                </ul>
              ))}
            </DescriptionItem>
          )}
        </DescriptionList>
      </div>
    );
  }
);

function IntegrationListItem({ integrationKind }) {
  const fullyQualifiedIntegration = fullyQualified[integrationKind];
  return <li className={`${block}__li`}>{fullyQualifiedIntegration.label}</li>;
}
