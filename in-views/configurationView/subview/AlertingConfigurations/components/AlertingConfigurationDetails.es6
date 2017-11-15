import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getIntegrations } from 'in-services/api/integrations';
import { getHealthRules } from 'in-services/api/healthRules';
import { emptyList } from 'in-services/fixedImmutables';
import { Row, Col } from 'in-components/Grid/Grid';
import connectTo from 'in-hoc/connectTo';

import './AlertingConfigurationDetails.less';

const block = 'in-alertings-config-details';

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
      <div className={block}>
        <DescriptionList>
          <DescriptionItem title="Query">{config.getIn(['eventFilteringConfiguration', 'query'])}</DescriptionItem>
          <DescriptionItem title="Event Type">
            {config.getIn(['eventFilteringConfiguration', 'eventType'])}
          </DescriptionItem>
        </DescriptionList>
        <Row>
          <Col cols={6}>
            <div className={`${block}__header`}>Rules</div>
            <ul className={`${block}__list`}>
              {healthRules.map(healthRule => (
                <li key={healthRule.get('id')} className={`${block}__item`}>
                  {healthRule.get('description')}
                </li>
              ))}
            </ul>
          </Col>
          <Col cols={6}>
            <div className={`${block}__header`}>Integrations</div>
            <ul className={`${block}__list`}>
              {integrations.map(integration => (
                <li key={integration.get('id')} className={`${block}__item`}>
                  {integration.get('kind')}
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
);
