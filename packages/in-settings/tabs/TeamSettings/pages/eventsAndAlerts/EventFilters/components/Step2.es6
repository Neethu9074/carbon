import React from 'react';

import {
  scopeApplication,
  scopeEverything,
  scopeDfq
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import ApplicationSelect from 'in-settings/tabs/TeamSettings/components/ApplicationSelect';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { evaluateClassNames } from 'in-services/util/classnames';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import LoadingIndicator from 'in-components/LoadingIndicator';
import FormGroup from 'in-settings/components/FormGroup';
import RuleControl from 'in-components/form/RuleControl';
import { Row, Col } from 'in-components/Grid/Grid';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Step from 'in-components/form/Step';
import Button from 'in-components/Button';
import Link from 'in-components/Link';

import './Step2.less';

const block = 'in-alerting-config-form-step-2';

export default function Step2({ form, setForm, onChange, onChangeApplyOn }) {
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
      </RuleControl>

      <RuleControl name="Apply on" helpComponent={QueryHelpComponent}>
        {form.get('applyOn').map(field => (
          <FormGroup>
            <ComboBox
              name="config-applyOn"
              value={field.value}
              options={[
                { value: scopeApplication, label: 'Application' },
                { value: scopeDfq, label: 'Selected entities (Dynamic Focus query)' },
                { value: scopeEverything, label: 'All available entities' }
              ]}
              clearable={false}
              onChange={e => {
                const updatedForm = onChangeApplyOn(form, e ? e.value : null);
                if (updatedForm) {
                  setForm(updatedForm);
                }
              }}
            />
            <TouchedMessages field={field} />
            {form.get('applyOn').value === scopeEverything && (
              <DescriptionText>
                <strong>Caution!</strong> All events that match the event types will enter the notification stream.
              </DescriptionText>
            )}
          </FormGroup>
        ))}
        {form.get('applyOn').value === scopeDfq &&
          form.get('query').map(field => (
            <FormGroup>
              <Label htmlFor="config-query" hasError={!field.valid && field.touched}>
                Dynamic Focus Query
              </Label>
              <Input
                id="config-query"
                type="text"
                placeholder={'e.g. entity.zone:"production" AND NOT event.text:"TCP*"'}
                className={`${block}__input`}
                value={field.value}
                onChange={e => onChange('query', e.target.value)}
                hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
              />
              {form.get('queryValidationInProgress').value && (
                <LoadingIndicator type="dark" className={`${block}__query-loading`} inline />
              )}
              <BackendValidationMessages validationResult={form.get('validationResult').value} />
              <TouchedMessages field={field} />
              <DescriptionText>
                A <strong>non-empty</strong> filter query which defines for which entities the configuration will be
                applied. Select <i>&quot;Apply on: All available entities&quot;</i> if you want this rule to be applied
                on all entities. For more information on syntax, please see our&nbsp;
                <Link href="https://docs.instana.io/core_concepts/dynamic_focus/#usage" external>
                  documentation
                </Link>
                .
              </DescriptionText>
            </FormGroup>
          ))}
        {form.get('applyOn').value === scopeApplication &&
          form.get('application').map(field => (
            <FormGroup>
              <Label hasError={!field.valid && field.touched}>Application</Label>
              <ApplicationSelect
                applicationName={field.value}
                onSelectApplicationName={applicationName => onChange('application', applicationName)}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        <MatchingEntitiesIndicator form={form} />
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
    <div className={`${block}__event-help`}>Only events of selected entities will enter the notification stream.</div>
  );
}
