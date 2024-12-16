/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  offlineDurationOptions,
  entityLabelOperatorOptions,
  entityTypesToExcludeInVerificationRule
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

export function ObserveHostHasMatchingEntitiesRunningFormGroup({ entityTypes, form, onChange, disabled }) {
  const entityTypeOptions = entityTypes.filter(
    ({ value }) => entityTypesToExcludeInVerificationRule.indexOf(value) === -1
  );

  const matchingEntityType = form.get('matchingEntityType');
  const matchingOperator = form.get('matchingOperator');
  const matchingEntityLabel = form.get('matchingEntityLabel');
  const offlineDuration = form.get('offlineDuration');

  return (
    <FormGroup noFlex>
      <Row>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="-entity-matchingtype" hasError={!matchingEntityType.valid && matchingEntityType.touch}>
              {t('in-settings:tabs.entityType')}
            </Label>
            <ComboBox
              isDisabled={disabled}
              name="matching-entity-type"
              value={matchingEntityType.value}
              options={entityTypeOptions}
              onChange={e => onChange('matchingEntityType', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={matchingEntityType} />
          </FormGroup>
        </Col>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="matching-operator" hasError={!matchingOperator.valid && matchingOperator.touched}>
              {t('in-settings:tabs.entityLabelOperator')}
            </Label>
            <ComboBox
              isDisabled={disabled}
              name="matching-operator"
              value={matchingOperator.value}
              options={entityLabelOperatorOptions}
              onChange={e => onChange('matchingOperator', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={matchingOperator} />
          </FormGroup>
        </Col>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="matching-entity-label" hasError={!matchingEntityLabel.valid && matchingEntityLabel.touched}>
              {t('in-settings:tabs.entityLabel')}
            </Label>
            <Input
              disabled={disabled}
              id="matching-entity-label"
              type="text"
              value={matchingEntityLabel.value || ''}
              onChange={e => onChange('matchingEntityLabel', e.target.value)}
              hasError={!matchingEntityLabel.valid && matchingEntityLabel.touched}
              maxLength={256}
              autoFocus
            />
            <TouchedMessages field={matchingEntityLabel} />
          </FormGroup>
        </Col>
        <Col lg={3}>
          <FormGroup>
            <Label htmlFor="offline-duration" hasError={!offlineDuration.valid && offlineDuration.touched}>
              {t('in-settings:tabs.offlineFor')}
            </Label>
            <ComboBox
              isDisabled={disabled}
              name="offline-duration"
              value={offlineDuration.value}
              options={offlineDurationOptions}
              onChange={e => onChange('offlineDuration', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={offlineDuration} />
          </FormGroup>
        </Col>
      </Row>
    </FormGroup>
  );
}
