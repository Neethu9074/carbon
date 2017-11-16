import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getIntegrations } from 'in-services/api/integrations';
import { getHealthRules } from 'in-services/api/healthRules';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/Grid/Grid';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const connectedHealthRules = props.config.getIn(['eventFilteringConfiguration', 'ruleIds'], emptyList).toArray();
    const connectedIntegrations = props.config.get('integrationIds', emptyList).toArray();

    return {
      healthRules: getHealthRules().map(healthRules => {
        const healthRulesMap = {};
        healthRules.forEach(healthRule => (healthRulesMap[healthRule.get('id')] = healthRule));

        return connectedHealthRules.map(id => healthRulesMap[id]).filter(resolved => resolved);
      }),
      integrations: getIntegrations().map(integrations => {
        const integrationsMap = {};
        integrations.forEach(integration => (integrationsMap[integration.get('id')] = integration));

        return connectedIntegrations.map(id => integrationsMap[id]).filter(resolved => resolved);
      })
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
