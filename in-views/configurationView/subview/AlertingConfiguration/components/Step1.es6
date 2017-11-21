import React from 'react';

// import MatchingEntityTable from 'in-views/configurationView/subview/AlertingConfiguration/components/MatchingEntityTable';
import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import ValidationBlock from 'in-components/form/ValidationBlock';
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
        const matchingEntities = field.value.snapshots || [];
        return (
          <span>
            {matchingEntities.length} {matchingEntities.length === 1 ? 'Entity' : 'Entities'} matched
          </span>
        );
      })}
    </div>
  );
}
