import React from 'react';

import SelectedEntities from 'in-views/configurationView/subview/AlertingConfiguration/components/SelectedEntities';
import { evaluateClassNames } from 'in-services/util/classnames';
import ValidationBlock from 'in-components/form/ValidationBlock';
import { getHealthRules } from 'in-services/api/healthRules';
import RuleControl from 'in-components/form/RuleControl';
import { Row, Col } from 'in-components/Grid/Grid';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Step from 'in-components/form/Step';
import Button from 'in-components/Button';

import './Step2.less';

const block = 'in-alerting-config-form-step-2';

export default function Step2({ form, onChange }) {
  const types = form.get('eventTypes').value;

  return (
    <Step number={1} title="Event Rules" form={form} onChange={onChange}>
      <RuleControl name="Criticality" helpText="Only send alerts which have these criticalities.">
        <Row>
          <LabelledToggle onChange={onChange} types={types} type="incident" />
          <LabelledToggle onChange={onChange} types={types} type="critical" title="Critical Issues" />
          <LabelledToggle onChange={onChange} types={types} type="warning" title="Warning Issues" />
        </Row>
        <Row>
          <LabelledToggle onChange={onChange} types={types} type="change" />
          <LabelledToggle onChange={onChange} types={types} type="online" />
          <LabelledToggle onChange={onChange} types={types} type="offline" />
        </Row>

        {form.get('advancedMode').map(field => (
          <div
            className={`${block}__advanced-options-label-wrapper`}
            onClick={() => onChange('advancedMode', !field.value)}
          >
            <span className={`${block}__bold-text`}>
              {`Send alerts on: ${field.value ? 'selected' : 'all'}  events & entities`}
            </span>
            <SvgIcon
              type={field.value ? 'triangle_up' : 'triangle_down'}
              className={`${block}__icon`}
              height={8}
              color="#172429"
            />
          </div>
        ))}

        {form.get('advancedMode').map(
          field =>
            field.value ? (
              <div>
                {form.get('query').map(eventQueryField => (
                  <div>
                    <Input
                      id="rule-query"
                      type="text"
                      placeholder="e.g: event.text:CPU*"
                      className={`${block}__input`}
                      value={eventQueryField.value}
                      onChange={e => onChange('query', e.target.value)}
                      hasError={!eventQueryField.valid}
                    />
                    {eventQueryField.messages.map((message, i) => (
                      <ValidationBlock hasError key={i}>
                        {message.message}
                      </ValidationBlock>
                    ))}
                    <MatchingEntitiesIndicator form={form} />
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

function LabelledToggle({ onChange, types, title, type }) {
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

function MatchingEntitiesIndicator({ form }) {
  return (
    <div className={`${block}__matching-entities-indicator`}>
      {form.get('matchingEntities').map(field => {
        const matchingEntities = field.value;
        return (
          <span>
            {matchingEntities.size} {matchingEntities.size === 1 ? 'Entity' : 'Entities'} matched
          </span>
        );
      })}
    </div>
  );
}
