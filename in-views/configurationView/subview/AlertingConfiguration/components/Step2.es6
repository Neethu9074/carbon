import React from 'react';

import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import Spacer from 'in-views/configurationView/subview/AlertingConfiguration/components/Spacer';
import { evaluateClassNames } from 'in-services/util/classnames';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { getHealthRules } from 'in-services/api/healthRules';
import RuleControl from 'in-components/form/RuleControl';
import { Row, Col } from 'in-components/Grid/Grid';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import Step from 'in-components/form/Step';
import Button from 'in-components/Button';

import './Step2.less';

const block = 'in-alerting-config-form-step-2';

export default function Step2({ form, onChange }) {
  const types = form.get('eventTypes').value;

  return (
    <Step number={2} title="Event Rules" form={form} onChange={onChange}>
      <RuleControl name="Criticality" helpText="Only send alerts which have these criticalities ">
        <Row>
          <LabeledToggle onChange={onChange} types={types} type="incident" />
          <LabeledToggle onChange={onChange} types={types} type="critical" title="Critical Issues" />
          <LabeledToggle onChange={onChange} types={types} type="warning" title="Warning Issues" />
        </Row>
        <Row>
          <LabeledToggle onChange={onChange} types={types} type="change" />
          <LabeledToggle onChange={onChange} types={types} type="online" />
          <LabeledToggle onChange={onChange} types={types} type="offline" />
        </Row>

        {form.get('advancedMode').map(field => (
          <div
            className={`${block}__advanced-options-label-wrapper`}
            onClick={() => onChange('advancedMode', !field.value)}
          >
            {field.value ? 'Hide' : 'Show'} advanced options
            <SvgIcon
              type={field.value ? 'triangle_up' : 'triangle_down'}
              className={`${block}__icon`}
              height={8}
              color="#172429"
            />
          </div>
        ))}

        {form.get('advancedMode').map(field => (field.value ? <Spacer /> : null))}

        {form.get('advancedMode').map(
          field =>
            field.value ? (
              <div>
                <div className={`${block}__filter-label-wrapper`}>
                  <Label className={`${block}__filter-label`} htmlFor="rule-query" hasError={!field.valid}>
                    Filter event rules
                  </Label>
                </div>
                {form.get('eventQuery').map(eventQueryField => (
                  <div>
                    <Input
                      id="rule-query"
                      type="text"
                      placeholder="e.g: event.text:CPU*"
                      className={`${block}__input`}
                      value={eventQueryField.value}
                      onChange={e => onChange('eventQuery', e.target.value)}
                      hasError={!eventQueryField.valid}
                    />
                    {eventQueryField.messages.map((message, i) => (
                      <ValidationBlock hasError key={i}>
                        {message.message}
                      </ValidationBlock>
                    ))}
                  </div>
                ))}
                <SelectedEntities
                  form={form}
                  onChange={onChange}
                  getItems={getHealthRules}
                  fieldName="description"
                  formFieldName="ruleIds"
                />
              </div>
            ) : null
        )}
      </RuleControl>
    </Step>
  );
}

function LabeledToggle({ onChange, types, title, type }) {
  return (
    <Col cols={4}>
      <Button
        className={evaluateClassNames({
          [`${block}__button`]: true,
          [`${block}__button--selected`]: types.includes(type)
        })}
        onClick={() => onSelectChanged(types, onChange, type)}
      >
        {title || type}
      </Button>
    </Col>
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
