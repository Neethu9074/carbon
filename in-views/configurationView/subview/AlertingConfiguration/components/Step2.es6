import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import ValidationBlock from 'in-components/form/ValidationBlock';
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
      <RuleControl name="Notify on" helpText="Only send alerts for these event types.">
        <Row>
          <LabelledToggle onChange={onChange} types={types} type="incident" title="Incidents" />
          <LabelledToggle onChange={onChange} types={types} type="critical" title="Critical Issues" />
          <LabelledToggle onChange={onChange} types={types} type="warning" title="Warning Issues" />
        </Row>
        <Row>
          <LabelledToggle onChange={onChange} types={types} type="change" title="Changes" />
          <LabelledToggle onChange={onChange} types={types} type="online" title="Online" />
          <LabelledToggle onChange={onChange} types={types} type="offline" title="Offline" />
        </Row>

        {form.get('advancedMode').map(field => (
          <div
            className={`${block}__advanced-options-label-wrapper`}
            onClick={() => onChange('advancedMode', !field.value)}
          >
            <span className={`${block}__bold-text`}>Advanced Filter:</span>
            <SvgIcon
              type={field.value ? 'triangle_up' : 'triangle_down'}
              className={`${block}__icon`}
              height={8}
              color="#172429"
            />
          </div>
        ))}
      </RuleControl>
      {form.get('advancedMode').map(
        field =>
          field.value ? (
            <RuleControl
              name=""
              helpText="Only events that match the advanced filter will enter the notification stream. When empty, no filter is applied. For example, to only receive notifications for a prod environment: 'entity.zone:production'."
            >
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
            </RuleControl>
          ) : null
      )}
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
        {title}
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
        if (!matchingEntities) {
          return null;
        }

        return (
          <div className={`${block}__matching-text`}>
            {matchingEntities >= 1000 ? '>' : ''}
            {matchingEntities} {matchingEntities === 1 ? 'event' : 'events'} match over the past week
          </div>
        );
      })}
    </div>
  );
}
