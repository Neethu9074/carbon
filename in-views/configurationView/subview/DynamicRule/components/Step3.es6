import { fromJS } from 'immutable';
import React from 'react';

import RuleControl from 'in-views/configurationView/subview/DynamicRule/components/RuleControl';
import TooltipIcon from 'in-views/configurationView/subview/DynamicRule/components/TooltipIcon';
import Spacer from 'in-views/configurationView/subview/DynamicRule/components/Spacer';
import Step from 'in-views/configurationView/subview/DynamicRule/components/Step';
import { evaluateClassNames } from 'in-services/util/classnames';
import ValidationBlock from 'in-components/form/ValidationBlock';
import EventDescription from 'in-components/EventDescription';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Toggle from 'in-components/form/Toggle';
import { Row, Col } from 'in-components/Grid';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import './Step3.less';

const block = 'in-dynamic-rule-dialog-step-3';

export default function Step3({ form, onChange }) {
  return (
    <Step number={3} title="Event" form={form} onChange={onChange}>
      <RuleControl name="Created when limits are surpassed" helpComponent={EventHelpComponent}>
        {form.get('triggering').map(field => (
          <FormGroup className={`${block}__triggering-group`}>
            <div className={`${block}__triggering`}>
              <TooltipIcon tooltip="Incidents represent the highest alert mode in Instana. Related events are associated with an incident for easy root cause analysis." />
              Create Incident
              <Toggle
                className={`${block}__toggle`}
                checked={field.value}
                onChange={e => onChange('triggering', e.target.checked)}
              />
            </div>
          </FormGroup>
        ))}
        {form.get('severity').map(field => (
          <FormGroup>
            <Label htmlFor="rule-event-severity">Severity</Label>
            <Row>
              <Col cols={6}>
                <SeveritySelection
                  title="Critical"
                  iconType="critical"
                  field={field}
                  onChange={onChange}
                  severity={10}
                />
              </Col>
              <Col cols={6}>
                <SeveritySelection title="Warning" iconType="warning" field={field} onChange={onChange} severity={5} />
              </Col>
            </Row>
          </FormGroup>
        ))}
        {form.get('text').map(field => (
          <FormGroup>
            <Label htmlFor="rule-event-text" hasError={!field.valid}>
              Title
            </Label>
            <Input
              id="rule-event-text"
              type="text"
              value={field.value}
              onChange={e => onChange('text', e.target.value)}
              hasError={!field.valid}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}
        {form.get('description').map(field => (
          <FormGroup>
            <Label htmlFor="rule-event-description" hasError={!field.valid}>
              Description
            </Label>
            <TextArea
              id="rule-event-description"
              className={`${block}__description`}
              value={field.value}
              onChange={e => onChange('description', e.target.value)}
              hasError={!field.valid}
            />
            {field.messages.map((message, i) => (
              <ValidationBlock hasError key={i}>
                {message.message}
              </ValidationBlock>
            ))}
          </FormGroup>
        ))}
        <div className={`${block}__event-preview`}>
          <Tooltip
            content={
              <EventDescription
                className={`${block}__issue-preview`}
                event={createEvent(form)}
                snapshotId="snapshotId"
                isNotClickable
              />
            }
          >
            <div className={`${block}__event-preview-wrapper`}>
              <SvgIcon type="eye" className={`${block}__preview-icon`} color="#6B8088" width={20} />
              Event Preview
            </div>
          </Tooltip>
        </div>
      </RuleControl>

      <Spacer />

      <RuleControl name="Trigger corresponding events based on the sensitivity settings">
        {form.get('enabled').map(field => (
          <Row>
            <Col cols={6}>
              <CreateEventSelection title="Yes, tigger Events" field={field} onChange={onChange} value />
            </Col>
            <Col cols={6}>
              <CreateEventSelection
                title="No, don't trigger Events yet"
                field={field}
                onChange={onChange}
                value={false}
              />
            </Col>
          </Row>
        ))}
      </RuleControl>
    </Step>
  );
}

function CreateEventSelection({ field, title, value, onChange }) {
  const isActive = field.value === value;
  return (
    <div
      className={evaluateClassNames({
        [`${block}__button`]: true,
        [`${block}__enable-events--is-active`]: isActive
      })}
      onClick={() => onChange('enabled', value)}
    >
      {title}
    </div>
  );
}

function SeveritySelection({ field, iconType, title, severity, onChange }) {
  const isActive = field.value === severity;
  return (
    <div
      className={evaluateClassNames({
        [`${block}__button`]: true,
        [`${block}__severity__active--${severity}`]: isActive
      })}
      onClick={() => onChange('severity', severity)}
    >
      <SvgIcon type={iconType} className={`${block}__icon`} color={isActive ? '#fff' : '#000'} height={16} width={16} />
      {title}
    </div>
  );
}

function createEvent(form) {
  return fromJS({
    id: 'uuid',
    start: Date.now() - 1000 * 60 * 10,
    end: Date.now(),
    problem: {
      fixSuggestion: form.get('description').value || 'description',
      id: 'uuid',
      problemText: form.get('text').value || 'title',
      snapshotId: 'snapshotId',
      severity: form.get('severity').value
    },
    state: 'open',
    type: 'issue'
  });
}

function EventHelpComponent() {
  return (
    <div className={`${block}__event-help`}>
      Define the event, its severity, and if it should trigger an incident. These properties will affect the event’s
      presentation and its alerting behavior. Learn more about events in the&nbsp;
      <Link className={`${block}__link`} href="https://docs.instana.io/core_concepts/events_and_incidents" external>
        docs
      </Link>
      .
    </div>
  );
}
