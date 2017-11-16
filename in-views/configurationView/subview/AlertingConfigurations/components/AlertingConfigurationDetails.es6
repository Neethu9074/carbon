import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getIntegrationsByIds } from 'in-services/api/integrations';
import { getHealthRulesByIds } from 'in-services/api/healthRules';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/Grid/Grid';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const connectedHealthRules = props.config.getIn(['eventFilteringConfiguration', 'ruleIds'], emptyList).toArray();
    const connectedIntegrations = props.config.get('integrationIds', emptyList).toArray();

    return {
      healthRules: getIntegrationsByIds(connectedIntegrations),
      integrations: getHealthRulesByIds(connectedHealthRules)
    };
  },
  function AlertingConfigurationDetails({ config, healthRules = [], integrations = [] }) {
    if (!config) {
      return null;
    }

    return (
      <div>
        <DescriptionList>
          <DescriptionItem title="Query">{config.getIn(['eventFilteringConfiguration', 'query'])}</DescriptionItem>
          <DescriptionItem title="Event Type">
            {config.getIn(['eventFilteringConfiguration', 'eventType'])}
          </DescriptionItem>
        </DescriptionList>
        <Row>
          <Col cols={6}>
            <DescriptionList>
              <DescriptionItem title="Event Rules">
                {healthRules.map(healthRule => <div key={healthRule.get('id')}>{healthRule.get('description')}</div>)}
              </DescriptionItem>
            </DescriptionList>
          </Col>
          <Col cols={6}>
            <DescriptionList>
              <DescriptionItem title="Integrations">
                {integrations.map(integration => <div key={integration.get('id')}>{integration.get('kind')}</div>)}
              </DescriptionItem>
            </DescriptionList>
          </Col>
        </Row>
      </div>
    );
  }
);
