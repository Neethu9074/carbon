import React from 'react';

import MatchingEntityTable from 'in-views/configurationView/subview/AlertingConfiguration/MatchingEntityTable';
import FormDataEnrichment from 'in-views/configurationView/subview/AlertingConfiguration/FormDataEnrichment';
import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/SelectedEntities';
import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import Section from 'in-views/configurationView/components/Section';
import { getIntegrationsByIds } from 'in-services/api/integrations';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { getIntegrations } from 'in-services/api/integrations';
import { getHealthRules } from 'in-services/api/healthRules';
import RuleControl from 'in-components/form/RuleControl';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Step from 'in-components/form/Step';
import connectTo from 'in-hoc/connectTo';

import './AlertingConfigurationForm.less';

const block = 'in-alerting-config-form';

export default connectTo(
  props => {
    const connectedIntegrations = props.form.get('integrationIds').value;

    return {
      integrations: getIntegrationsByIds(connectedIntegrations)
    };
  },
  function AlertingConfigurationForm({ form, onChange }) {
    return (
      <fieldset>
        <FormDataEnrichment form={form} onChange={onChange} />
        <Section>
          {form.get('name').map(field => (
            <FormGroup className={block}>
              <Label htmlFor="name" hasError={!field.valid}>
                Config Name
              </Label>
              <Input
                id="name"
                className={`${block}__input`}
                type="text"
                value={field.value}
                onChange={e => onChange('name', e.target.value)}
                hasError={!field.valid}
              />
              {field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
            </FormGroup>
          ))}
        </Section>
        <Step number={1} title="Entities" form={form} onChange={onChange}>
          <RuleControl name="Entities" helpText="Entities the rule will be applied on.">
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
                  className={`${block}__input`}
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
          </RuleControl>
        </Step>
        <Step number={2} title="Event Rules" form={form} onChange={onChange}>
          <SelectedEntities
            form={form}
            onChange={onChange}
            getItems={getHealthRules}
            fieldName="description"
            formFieldName="ruleIds"
          />
        </Step>
        <Step number={3} title="Integrations" form={form} onChange={onChange}>
          <SelectedEntities
            form={form}
            onChange={onChange}
            getItems={getIntegrations}
            fieldName="kind"
            formFieldName="integrationIds"
            addNewItem={() => console.log('add new')}
            NewItemComponent={NewItemComponent}
          />
        </Step>
      </fieldset>
    );
  }
);

function NewItemComponent() {
  return <div className={`${block}__add-new-item`}>+ Add New</div>;
}
