import React from 'react';

import MatchingEntityTable from 'in-views/configurationView/subview/AlertingConfiguration/MatchingEntityTable';
import FormDataEnrichment from 'in-views/configurationView/subview/AlertingConfiguration/FormDataEnrichment';
import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import Section from 'in-views/configurationView/components/Section';
import { getIntegrationsByIds } from 'in-services/api/integrations';
import { getHealthRulesByIds } from 'in-services/api/healthRules';
import ValidationBlock from 'in-components/form/ValidationBlock';
import LoadingIndicator from 'in-components/LoadingIndicator';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import './AlertingConfigurationForm.less';

const block = 'in-alerting-config-form';

export default connectTo(
  props => {
    const connectedHealthRules = props.form.get('ruleIds').value;
    const connectedIntegrations = props.form.get('integrationIds').value;

    return {
      integrations: getIntegrationsByIds(connectedIntegrations),
      healthRules: getHealthRulesByIds(connectedHealthRules)
    };
  },
  function AlertingConfigurationForm({ healthRules, integrations, form, onChange }) {
    if (!healthRules || !integrations) {
      return <LoadingIndicator type="dark" />;
    }

    return (
      <fieldset>
        <FormDataEnrichment form={form} onChange={onChange} />
        <Section>
          {form.get('query').map(field => (
            <FormGroup>
              <div className={`${block}__filter-label-wrapper`}>
                <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid}>
                  Filter query
                </Label>
                <TooltipIcon tooltip="Apply a filter query to narrow down the number of entities the rule shall be applied on. If no filter query is given, it will be applied on all entities." />
              </div>
              <Input
                id="rule-query"
                type="text"
                placeholder="e.g: entity.zone:prod"
                className={`${block}__helpfified_input`}
                value={field.value}
                onChange={e => onChange('query', e.target.value)}
                hasError={!field.valid}
              />
              {field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
              <MatchingEntityTable form={form} />
            </FormGroup>
          ))}
        </Section>
      </fieldset>
    );
  }
);
