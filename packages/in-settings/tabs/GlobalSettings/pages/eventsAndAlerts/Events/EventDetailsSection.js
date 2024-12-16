/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { Spacer, Toggle } from '@instana/components';
import { TextArea } from '@instana/components';

import {
  severityOptions,
  getOptionsWithAdditionalValueIfMissing,
  gracePeriodOptions
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import EventDescription from 'in-events/components/EventDescription';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import HelpText from 'in-components/form/HelpText';
import Helpify from 'in-components/form/Helpify';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/EventDetailsSection.mless';

export function EventDetailsSection({ form, onChange, disabled }) {
  return (
    <Row>
      <Col lg={8}>
        <Fragment>
          {form.get('name').map(field => (
            <FormGroup>
              <Label htmlFor="event-name" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.name')}
              </Label>
              <Input
                disabled={disabled}
                id="event-name"
                type="text"
                value={field.value}
                onChange={e => onChange('name', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={256}
                autoFocus
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>{t('in-settings:tabs.showsUpInTheListOfEvents')}</HelpText>
            </FormGroup>
          ))}
          {form.get('description').map(field => (
            <FormGroup>
              <Label htmlFor="event-description" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.description')}
              </Label>
              <TextArea
                disabled={disabled}
                id="event-description"
                rows="3"
                value={field.value}
                onChange={e => onChange('description', e.target.value)}
                hasError={!field.valid && field.touched}
                maxLength={65536}
              />
              <TouchedMessages field={field} className={locals.subErrorTextFormField} />
              <HelpText className={locals.subTextFormField}>
                {t('in-settings:tabs.showsUpInTheIssueDescription')}
              </HelpText>
            </FormGroup>
          ))}
          <FormGroup noFlex>
            <Row>
              <Col lg={4}>
                {form.get('severity').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-severity" hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.issueSeverity')}
                    </Label>
                    <ComboBox
                      isDisabled={disabled}
                      name="event-severity"
                      value={field.value}
                      options={severityOptions}
                      onChange={e => onChange('severity', e ? e.value : '')}
                      isClearable={false}
                    />
                    <TouchedMessages field={field} />
                  </FormGroup>
                ))}
              </Col>
              <Col lg={4}>
                {form.get('triggering').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-triggering">{t('in-settings:tabs.incident')}</Label>
                    <Spacer horizontal="xxsmall" />
                    <Toggle
                      disabled={disabled}
                      id="event-triggering"
                      checked={field.value}
                      onToggle={e => onChange('triggering', e)}
                    />
                  </FormGroup>
                ))}
              </Col>
              <Col lg={4}>
                {form.get('gracePeriod').map(field => (
                  <FormGroup>
                    <Label htmlFor="event-grace-period" hasError={!field.valid && field.touched}>
                      {t('in-settings:tabs.gracePeriod')}
                    </Label>
                    <Helpify
                      helpText={t('in-settings:tabs.periodToWaitBeforeClosingTheIssueOnceConditionsAreNoLongerMet')}
                    >
                      <ComboBox
                        isDisabled={disabled}
                        name="event-grace-period"
                        value={field.value}
                        className={locals.helpified}
                        options={getOptionsWithAdditionalValueIfMissing(gracePeriodOptions, field.value)}
                        onChange={e => onChange('gracePeriod', e?.value ?? '')}
                        isClearable={false}
                      />
                      <TouchedMessages field={field} />
                    </Helpify>
                  </FormGroup>
                ))}
              </Col>
            </Row>
          </FormGroup>
        </Fragment>
      </Col>
      <Col lg={4}>
        <FormGroup>
          <Label>{t('in-settings:tabs.issuePreview')}</Label>
          <EventDescription
            className={locals.issuePreview}
            event={createIssueForPreview(form)}
            snapshotId="snapshotId"
            isNotClickable
            isPreview
          />
        </FormGroup>
      </Col>
    </Row>
  );
}

const previewStartDate = Date.now();

function createIssueForPreview(form) {
  return fromJS({
    id: 'uuid',
    start: previewStartDate,
    end: null,
    problem: {
      fixSuggestion: form.get('description').value,
      id: 'uuid',
      problemText: form.get('name').value,
      snapshotId: 'snapshotId',
      severity: form.get('severity').value
    },
    state: 'open',
    type: 'issue'
  });
}
