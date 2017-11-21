import React from 'react';

import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import Spacer from 'in-views/configurationView/subview/AlertingConfiguration/components/Spacer';
import { evaluateClassNames } from 'in-services/util/classnames';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { getHealthRules } from 'in-services/api/healthRules';
import RuleControl from 'in-components/form/RuleControl';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Step from 'in-components/form/Step';
import Button from 'in-components/Button';

import './Step2.less';

const block = 'in-alerting-config-form-step-2';

export default function Step2({ form, onChange }) {
  const types = form.get('eventTypes').value;

  return (
    <Step number={2} title="Event Rules" form={form} onChange={onChange}>
      <div onClick={() => onChange('advancedMode', !form.get('advancedMode').value)}>test</div>

      {form.get('advancedMode').value ? (
        <RuleControl name="Events">
          {form.get('eventQuery').map(field => (
            <FormGroup>
              <div className={`${block}__filter-label-wrapper`}>
                <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid}>
                  Filter event rules
                </Label>
              </div>
              <Input
                id="rule-query"
                type="text"
                placeholder="e.g: event.text:CPU*"
                className={`${block}__input`}
                value={field.value}
                onChange={e => onChange('eventQuery', e.target.value)}
                hasError={!field.valid}
              />
              <SelectedEntities
                form={form}
                onChange={onChange}
                getItems={getHealthRules}
                fieldName="description"
                formFieldName="ruleIds"
              />
              {field.messages.map((message, i) => (
                <ValidationBlock hasError key={i}>
                  {message.message}
                </ValidationBlock>
              ))}
            </FormGroup>
          ))}
        </RuleControl>
      ) : null}
      {form.get('advancedMode').value ? <Spacer /> : null}

      <div className={`${block}__labeled-toggle-group`}>
        <LabeledToggle onChange={onChange} types={types} type="incident" />
        <LabeledToggle onChange={onChange} types={types} type="critical" title="Critical Issues" />
        <LabeledToggle onChange={onChange} types={types} type="warning" title="Warning Issues" />
        <LabeledToggle onChange={onChange} types={types} type="change" />
        <LabeledToggle onChange={onChange} types={types} type="online" />
        <LabeledToggle onChange={onChange} types={types} type="offline" />
      </div>
    </Step>
  );
}

function LabeledToggle({ onChange, types, title, type }) {
  return (
    <Button
      className={evaluateClassNames({
        [`${block}__button`]: true,
        [`${block}__button--selected`]: types.includes(type)
      })}
      onClick={() => onSelectChanged(types, onChange, type)}
    >
      {title || type}
    </Button>
  );
}

function onSelectChanged(types, onChange, type) {
  const containsType = types.includes(type);

  if (containsType) {
    types = types.delete(types.indexOf(type));
  } else {
    types = types.push(type);
  }

  onChange('eventTypes', types);
}
