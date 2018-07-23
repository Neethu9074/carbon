import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ValidationBlock from 'in-components/form/ValidationBlock';
import RuleControl from 'in-components/form/RuleControl';
import { Row, Col } from 'in-components/Grid/Grid';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';
import Step from 'in-components/form/Step';
import Button from 'in-components/Button';
import Link from 'in-components/Link';

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
        <TouchedMessages field={form.get('eventTypes')} />

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
            <RuleControl name="" helpComponent={QueryHelpComponent}>
              {form.get('query').map(eventQueryField => (
                <div>
                  <Input
                    id="rule-query"
                    type="text"
                    placeholder={'e.g. entity.zone:"production" AND NOT event.text:"TCP*"'}
                    className={`${block}__input`}
                    value={eventQueryField.value}
                    onChange={e => onChange('query', e.target.value)}
                    hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
                  />
                  <BackendValidationMessages validationResult={form.get('validationResult').value} />
                  <MatchingEntitiesIndicator form={form} />
                </div>
              ))}
            </RuleControl>
          ) : null
      )}
      {form.get('advancedMode').map(field => (field.value ? null : <MatchingEntitiesIndicator form={form} />))}
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

function BackendValidationMessages({ validationResult }) {
  if (validationResult.valid) {
    return null;
  }

  return <ValidationBlock hasError>{`${validationResult.error}.`}</ValidationBlock>;
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
        if (!matchingEntities && matchingEntities != 0) {
          return null;
        }

        return (
          <div className={`${block}__matching-text`}>
            {matchingEntities >= 10000 ? '>' : ''}
            {matchingEntities} {matchingEntities === 1 ? 'event' : 'events'} match over the past 2 weeks
          </div>
        );
      })}
    </div>
  );
}

function QueryHelpComponent() {
  return (
    <div className={`${block}__event-help`}>
      Only events that match the event types and the advanced filter will enter the notification stream. When empty, no
      filter is applied. For more information on syntax, please see our&nbsp;
      <Link className={`${block}__link`} href="https://docs.instana.io/core_concepts/dynamic_focus/#usage" external>
        documentation
      </Link>
      .
    </div>
  );
}
