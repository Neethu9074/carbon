import {fromJS} from 'immutable';
import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import Section from 'in-views/configurationView/components/Section';
import ValidationBlock from 'in-components/form/ValidationBlock';
import EventDescription from 'in-components/EventDescription';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import TextArea from 'in-components/form/TextArea';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import {Row, Col} from 'in-components/Grid';

import './RuleBindingForm.less';


const block = 'in-rule-binding-form';

export default function RuleBindingForm({rules, form, onChange, onChangeInRuleIds}) {
  return (
    <fieldset>
      <Section>
        <div>
          {form.get('ruleIds').map(field =>
            <FormGroup>
              <Label htmlFor='ruleBinding-rule'
                     hasError={!field.valid}>
                Rule
              </Label>
              <select onChange={e => onChangeInRuleIds(e.target.value)}
                      value={String(field.value.get(0))}
                      id='ruleBinding-rule'>
                <option value=''>
                  Please select
                </option>
                {rules.map(rule =>
                  <option value={rule.get('id')}
                          key={rule.get('id')}>
                    {rule.get('name')}
                  </option>
                )}
              </select>
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
              <HelpBlock>
                The Rule to be bound.
              </HelpBlock>
            </FormGroup>
          )}
        </div>

        {form.get('query').map(field =>
          <FormGroup>
            <Label htmlFor='ruleBinding-query'
                   hasError={!field.valid}>
              Applied on filter query
            </Label>
            <Input id='ruleBinding-query'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('query', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              A search query which filters all entities that should be targeted by this binding.
            </HelpBlock>
          </FormGroup>
        )}
        <Row>
          <Col cols={4}>
            {form.get('severity').map(field =>
              <FormGroup>
                <Label htmlFor='alert-severity'
                       hasError={!field.valid}>
                  Severity
                </Label>
                <select onChange={e => onChange('severity', e.target.value)}
                        value={field.value}
                        id='alert-severity'>
                  <option value=''>
                    Please select
                  </option>
                  <option value='0'>
                    change
                  </option>
                  <option value='5'>
                    warning
                  </option>
                  <option value='10'>
                    critical
                  </option>
                </select>
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
                <HelpBlock>
                  The severity of issues, created by this rule binding.
                </HelpBlock>
              </FormGroup>
            )}
          </Col>
          <Col cols={4}>
            {form.get('expirationTime').map(field =>
              <FormGroup>
                <Label htmlFor='alert-expirationTime'
                       hasError={!field.valid}>
                  Expiration time
                </Label>
                <select onChange={e => onChange('expirationTime', e.target.value)}
                        value={field.value}
                        id='alert-expirationTime'>
                  <option key=''
                          value=''>
                    Please select
                  </option>
                  <option value='5000'>
                    5s
                  </option>
                  <option value='10000'>
                    10s
                  </option>
                  <option value='60000'>
                    1min
                  </option>
                  <option value='300000'>
                    5min
                  </option>
                </select>
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
                <HelpBlock>
                  The time events are kept as open.
                </HelpBlock>
              </FormGroup>
            )}
          </Col>
          <Col cols={4}>
            {form.get('triggering').map(field =>
              <FormGroup>
                <Label htmlFor='alert-triggering'>
                  Triggering
                </Label>
                <Toggle id='alert-triggering'
                        className={`${block}__toggle`}
                        checked={field.value}
                        onChange={e => onChange('triggering', e.target.checked)} />
                <HelpBlock>
                  Does this issue triggeres an incident?
                </HelpBlock>
              </FormGroup>
            )}
          </Col>
        </Row>
        {form.get('text').map(field =>
          <FormGroup>
            <Label htmlFor='alert-text'
                   hasError={!field.valid}>
              Text
            </Label>
            <Input id='alert-text'
                   type='text'
                   value={field.value}
                   onChange={e => onChange('text', e.target.value)}
                   hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              This text is used as events text when an issue of this binding happens.
            </HelpBlock>
          </FormGroup>
        )}

        {form.get('description').map(field =>
          <FormGroup>
            <Label htmlFor='alert-description'
                   hasError={!field.valid}>
              Description
            </Label>
            <TextArea id='alert-description'
                      rows='3'
                      value={field.value}
                      onChange={e => onChange('description', e.target.value)}
                      hasError={!field.valid} />
            {field.messages.map((message, i) =>
              <ValidationBlock hasError
                               key={i}>
                {message.message}
              </ValidationBlock>
            )}
            <HelpBlock>
              This text is used as events description when an issue of this binding happens.
            </HelpBlock>
          </FormGroup>
        )}
      </Section>

      <Section>
        <SectionHeading>
          Event preview
        </SectionHeading>
        <EventDescription className={`${block}__issue-preview`}
                          event={createEvent(form)}
                          snapshotId='snapshotId' />
      </Section>
    </fieldset>
  );
}

function createEvent(form) {
  return fromJS({
    id: 'uuid',
    start: 1489071311000,
    end: null,
    problem: {
      fixSuggestion: form.get('description').value,
      id: 'uuid',
      problemText: form.get('text').value,
      snapshotId: 'snapshotId',
      severity: form.get('severity').value
    },
    state: 'open',
    type: 'issue'
  });
}
