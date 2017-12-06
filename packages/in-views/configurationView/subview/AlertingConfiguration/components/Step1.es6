import React from 'react';

import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import TouchedMessages from 'in-components/form/TouchedMessages';
import RuleControl from 'in-components/form/RuleControl';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Step from 'in-components/form/Step';

import './Step1.less';

const block = 'in-alerting-config-form-step-1';

export default function Step1({ form, onChange }) {
  return (
    <Step number={1} title="Entities" form={form} onChange={onChange}>
      <RuleControl name="Entities" helpText="Entities the rule will be applied on.">
        {form.get('query').map(field => (
          <FormGroup>
            <div className={`${block}__filter-label-wrapper`}>
              <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid && field.touched}>
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
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
            <MatchingEntitiesIndicator form={form} />
          </FormGroup>
        ))}
      </RuleControl>
    </Step>
  );
}

function MatchingEntitiesIndicator({ form }) {
  return (
    <div className={`${block}__matching-entities-indicator`}>
      {form.get('matchingEntities').map(field => {
        const matchingEntities = field.value;
        if (!matchingEntities) {
          return null;
        }
        return (
          <span>
            {matchingEntities >= 1000 ? '>' : ''}
            {matchingEntities} {matchingEntities === 1 ? 'Event' : 'Events'} matched
          </span>
        );
      })}
    </div>
  );
}
