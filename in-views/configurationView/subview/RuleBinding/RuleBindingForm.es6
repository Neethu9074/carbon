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
import ComboBox from 'in-components/ComboBox';
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
              <ComboBox name='ruleBinding-rule'
                        value={String(field.value.get(0))}
                        options={[{ value: '', label: 'Please select' }].concat(
                          rules.toArray().map(rule => {
                            return {
                              value: rule.get('id'),
                              label: rule.get('name')
                            };
                          })
                        )}
                        onChange={e => onChangeInRuleIds(e = e ? e.value : '')} />
              {field.messages.map((message, i) =>
                <ValidationBlock hasError
                                 key={i}>
                  {message.message}
                </ValidationBlock>
              )}
              <HelpBlock>
                Select rule that will trigger this issue.
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
              A filter query which defines for which entities the rule shall be applied.
            </HelpBlock>
          </FormGroup>
        )}
        <Row>
          <Col cols={4}>
            {form.get('severity').map(field =>
              <FormGroup>
                <Label htmlFor='ruleBinding-severity'
                       hasError={!field.valid}>
                  Severity
                </Label>
                <ComboBox name='ruleBinding-severity'
                          value={field.value}
                          options={[
                            { value: '', label: 'Please select' },
                            { value: '5', label: 'warning' },
                            { value: '10', label: 'critical' }
                          ]}
                          onChange={e => onChange('severity', e = e ? e.value : '')} />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
              </FormGroup>
            )}
          </Col>
          <Col cols={4}>
            {form.get('expirationTime').map(field =>
              <FormGroup>
                <Label htmlFor='ruleBinding-expirationTime'
                       hasError={!field.valid}>
                  Expiration time
                </Label>
                <ComboBox name='ruleBinding-expirationTime'
                          value={field.value}
                          options={[
                            { value: '', label: 'Please select' },
                            { value: '5000', label: '5s' },
                            { value: '10000', label: '10s' },
                            { value: '60000', label: '1min' },
                            { value: '300000', label: '5min' }
                          ]}
                          onChange={e => onChange('expirationTime', e = e ? e.value : '')} />
                {field.messages.map((message, i) =>
                  <ValidationBlock hasError
                                   key={i}>
                    {message.message}
                  </ValidationBlock>
                )}
                <HelpBlock>
                  Grace time an issue stays open.
                </HelpBlock>
              </FormGroup>
            )}
          </Col>
          <Col cols={4}>
            {form.get('triggering').map(field =>
              <FormGroup>
                <Label htmlFor='ruleBinding-triggering'>
                  Triggering
                </Label>
                <Toggle id='ruleBinding-triggering'
                        className={`${block}__toggle`}
                        checked={field.value}
                        onChange={e => onChange('triggering', e.target.checked)} />
              </FormGroup>
            )}
          </Col>
        </Row>
        {form.get('text').map(field =>
          <FormGroup>
            <Label htmlFor='ruleBinding-text'
                   hasError={!field.valid}>
              Text
            </Label>
            <Input id='ruleBinding-text'
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
          </FormGroup>
        )}

        {form.get('description').map(field =>
          <FormGroup>
            <Label htmlFor='ruleBinding-description'
                   hasError={!field.valid}>
              Description
            </Label>
            <TextArea id='ruleBinding-description'
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
