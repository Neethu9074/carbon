import { fromJS } from 'immutable';
import React from 'react';

import RuleDetails from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/CustomRules/components/RuleDetails';
import BackendValidationMessages from 'in-components/form/BackendValidationMessages';
import { getSystemRules, getRuleLabelWithDeprecationFlag } from 'in-api/rules';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import EventDescription from 'in-components/EventDescription';
import LoadingIndicator from 'in-components/LoadingIndicator';
import FormGroup from 'in-settings/components/FormGroup';
import Section from 'in-settings/components/Section';
import TextArea from 'in-components/form/TextArea';
import Helpify from 'in-components/form/Helpify';
import Toggle from 'in-components/form/Toggle';
import { find } from 'in-services/arrayUtils';
import { Row, Col } from 'in-components/Grid';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './CustomIssueForm.mless';

export default connectTo(
  {
    systemRules: getSystemRules()
  },
  function CustomIssueForm({
    systemRules,
    rules,
    form,
    onChange,
    onChangeInRuleIds,
    onChangeApplyOn,
    queryValidationInProgress
  }) {
    systemRules = systemRules || [];

    return (
      <fieldset>
        {form.get('ruleIds').map(field => {
          const selectedRule = field.value.get(0);
          const isSystemRule = selectedRule && find(systemRules, each => each.id == selectedRule) ? true : false;

          return (
            <FormGroup>
              <Label htmlFor="ruleBinding-rule" hasError={!field.valid && field.touched}>
                Rule
              </Label>
              <Helpify helpText="Select rule that will trigger this issue.">
                <RulesDropDown
                  rules={rules}
                  systemRules={systemRules}
                  value={String(field.value.get(0))}
                  onChangeInRuleIds={onChangeInRuleIds}
                />

                <TouchedMessages field={field} />
              </Helpify>

              {field.value.get(0) && !isSystemRule ? (
                <RuleDetails ruleId={String(field.value.get(0))} />
              ) : (
                <DescriptionText>
                  Track offline events in order to trigger issues on entities that should not go offline. Please define
                  a filter query to match the entities you want to put under offline observation.
                </DescriptionText>
              )}
            </FormGroup>
          );
        })}

        {form.get('applyOn').map(field => (
          <FormGroup>
            <Label htmlFor="ruleBinding-applyOn" hasError={!field.valid && field.touched}>
              Apply on
            </Label>
            <ComboBox
              name="ruleBinding-applyOn"
              value={field.value}
              options={[
                { value: 'dfq', label: 'Selected entities (Dynamic Focus query)' },
                { value: 'all', label: 'All available entities' }
              ]}
              clearable={false}
              onChange={e => onChangeApplyOn(e ? e.value : null)}
            />
            <TouchedMessages field={field} />
            {form.get('applyOn').value === 'all' && (
              <DescriptionText>
                <strong>Caution!</strong> This will match and create issues on all available entities for the conditions
                specified. <strong>This might affect other users in your organization as well.</strong>
              </DescriptionText>
            )}
          </FormGroup>
        ))}

        {form.get('applyOn').value === 'dfq' &&
          form.get('query').map(field => (
            <FormGroup>
              <Label htmlFor="ruleBinding-query" hasError={!field.valid && field.touched}>
                Dynamic Focus Query
              </Label>
              <Input
                id="ruleBinding-query"
                type="text"
                placeholder={'e.g. entity.zone:"prod" AND entity.service.name:"Shop"'}
                className={locals.helpified}
                value={field.value}
                onChange={e => onChange('query', e.target.value)}
                hasError={form.get('validationResult') && !form.get('validationResult').value.valid}
              />
              {queryValidationInProgress && <LoadingIndicator type="dark" className={locals.queryLoading} inline />}
              <BackendValidationMessages validationResult={form.get('validationResult').value} />
              <TouchedMessages field={field} />
              <DescriptionText>
                A <strong>non-empty</strong> filter query which defines for which entities the rule will be applied.
                Select <i>&quot;Apply on: All available entities&quot;</i> if you want this rule to be applied on all
                entities. For more information on syntax, please see our&nbsp;
                <Link href="https://docs.instana.io/core_concepts/dynamic_focus/#usage" external>
                  documentation
                </Link>
                .
              </DescriptionText>
            </FormGroup>
          ))}

        <FormGroup noFlex>
          <Row>
            <Col cols={4}>
              {form.get('severity').map(field => (
                <FormGroup>
                  <Label htmlFor="ruleBinding-severity" hasError={!field.valid && field.touched}>
                    Severity
                  </Label>
                  <ComboBox
                    name="ruleBinding-severity"
                    value={field.value}
                    options={[
                      { value: '', label: 'Please select' },
                      { value: '5', label: 'warning' },
                      { value: '10', label: 'critical' }
                    ]}
                    onChange={e => onChange('severity', (e = e ? e.value : ''))}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Col>
            <Col cols={4}>
              {form.get('expirationTime').map(field => (
                <FormGroup>
                  <Label htmlFor="ruleBinding-expirationTime" hasError={!field.valid && field.touched}>
                    Grace period
                  </Label>
                  <Helpify helpText="Period to wait before closing the issue once conditions are no longer met.">
                    <ComboBox
                      name="ruleBinding-expirationTime"
                      value={field.value}
                      className={locals.helpified}
                      options={[
                        { value: '', label: 'Please select' },
                        { value: '5000', label: '5s' },
                        { value: '10000', label: '10s' },
                        { value: '60000', label: '1min' },
                        { value: '300000', label: '5min' },
                        { value: '3600000', label: '60min' }
                      ]}
                      onChange={e => onChange('expirationTime', (e = e ? e.value : ''))}
                    />
                    <TouchedMessages field={field} />
                  </Helpify>
                </FormGroup>
              ))}
            </Col>
            <Col cols={4}>
              {form.get('triggering').map(field => (
                <FormGroup>
                  <Label htmlFor="ruleBinding-triggering">Triggering incident</Label>
                  <Toggle
                    id="ruleBinding-triggering"
                    className={locals.toggle}
                    checked={field.value}
                    onChange={e => onChange('triggering', e.target.checked)}
                  />
                </FormGroup>
              ))}
            </Col>
          </Row>
        </FormGroup>

        {form.get('text').map(field => (
          <FormGroup>
            <Label htmlFor="ruleBinding-text" hasError={!field.valid && field.touched}>
              Text
            </Label>
            <Input
              id="ruleBinding-text"
              type="text"
              value={field.value}
              onChange={e => onChange('text', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {form.get('description').map(field => (
          <FormGroup>
            <Label htmlFor="ruleBinding-description" hasError={!field.valid && field.touched}>
              Description
            </Label>
            <TextArea
              id="ruleBinding-description"
              rows="3"
              value={field.value}
              onChange={e => onChange('description', e.target.value)}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        <Section>
          <SectionHeading>Event preview</SectionHeading>
          <EventDescription
            className={locals.issuePreview}
            event={createEvent(form)}
            snapshotId="snapshotId"
            isNotClickable
          />
        </Section>
      </fieldset>
    );
  }
);

function RulesDropDown({ value, rules, systemRules, onChangeInRuleIds }) {
  return (
    <ComboBox
      name="ruleBinding-rule"
      value={value}
      className={locals.helpified}
      options={[{ value: '', label: 'Please select' }]
        .concat(
          rules.toArray().map(rule => {
            return {
              value: rule.get('id'),
              label: getRuleLabelWithDeprecationFlag(rule)
            };
          })
        )
        .concat(
          systemRules.map(rule => {
            return {
              value: rule.id,
              label: rule.name
            };
          })
        )}
      onChange={e => onChangeInRuleIds((e = e ? e.value : ''))}
    />
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
