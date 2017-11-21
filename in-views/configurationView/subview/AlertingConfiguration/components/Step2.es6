import { List } from 'immutable';
import React from 'react';

import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import Spacer from 'in-views/configurationView/subview/AlertingConfiguration/components/Spacer';
import { evaluateClassNames } from 'in-services/util/classnames';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { getHealthRules } from 'in-services/api/healthRules';
import RuleControl from 'in-components/form/RuleControl';
import FormGroup from 'in-components/form/FormGroup';
import { Row, Col } from 'in-components/Grid/Grid';
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
      {form.get('advancedMode').map(field => (
        <RuleControl name="Filter Event Rules">
          <div className={`${block}__button-wrapper`}>
            <AdvancedModeOption
              title="All event rules (simple mode)"
              isActive={field.value === false}
              onClick={() => {
                onChange(['eventQuery', 'advancedMode', 'ruleIds'], ['', false, List()]);
              }}
            />
            <AdvancedModeOption
              title="Pick event rules (advanced mode)"
              isActive={field.value === true}
              onClick={() => onChange('advancedMode', true)}
            />
          </div>
          {field.value ? (
            <FormGroup>
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
            </FormGroup>
          ) : null}
        </RuleControl>
      ))}

      <Spacer />

      <RuleControl name="Criticality" helpText="Only send alerts which have these criticalities ">
        <Row>
          <Col cols={4}>
            <LabeledToggle onChange={onChange} types={types} type="incident" />
          </Col>
          <Col cols={4}>
            <LabeledToggle onChange={onChange} types={types} type="critical" title="Critical Issues" />
          </Col>
          <Col cols={4}>
            <LabeledToggle onChange={onChange} types={types} type="warning" title="Warning Issues" />
          </Col>
        </Row>
        <Row>
          <Col cols={4}>
            <LabeledToggle onChange={onChange} types={types} type="change" />
          </Col>
          <Col cols={4}>
            <LabeledToggle onChange={onChange} types={types} type="online" />
          </Col>
          <Col cols={4}>
            <LabeledToggle onChange={onChange} types={types} type="offline" />
          </Col>
        </Row>
      </RuleControl>
    </Step>
  );
}

function AdvancedModeOption({ isActive, title, onClick }) {
  return (
    <div
      className={evaluateClassNames({
        [`${block}__advanced-mode-option`]: true,
        [`${block}__advanced-mode-option__active`]: isActive
      })}
      onClick={onClick}
    >
      {title}
    </div>
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
