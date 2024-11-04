/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { conditionOperatorOptions } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import { CustomEventSpecificationWithMetadata, Nullish } from 'in-types';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ComboBox, { Option } from 'in-components/ComboBox';
import FormGroup from 'in-settings/components/FormGroup';
import { Col, Row } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

interface Props {
  form: MapForm<any>;
  onChange: (
    fieldName: string,
    value: string | Nullish,
    updateFormDefinition?: (mapForm: MapForm<any>, entity: CustomEventSpecificationWithMetadata) => MapForm<any>
  ) => MapForm<any>;
  disabled?: boolean;
}

export default function EntityCountDetectionFormGroup({ form, onChange, disabled }: Props) {
  return (
    <FormGroup noFlex>
      <Row>
        <Col lg={2}>
          <FormGroup>
            {(form.get('conditionOperator') as Field<string>).map(field => (
              <FormGroup>
                <Label htmlFor="event-conditionOperator" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.operator')}
                </Label>
                <ComboBox
                  isDisabled={disabled}
                  name="event-conditionOperator"
                  value={field.value}
                  options={conditionOperatorOptions}
                  onChange={e => onChange('conditionOperator', e ? (e as Option).value : null)}
                  isClearable={false}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </FormGroup>
        </Col>
        <Col lg={2}>
          <FormGroup>
            {(form.get('conditionValue') as Field<string>).map(field => (
              <FormGroup>
                <Label htmlFor="event-conditionValue" hasError={!field.valid && field.touched}>
                  {t('in-settings:tabs.count')}
                </Label>
                <Input
                  disabled={disabled}
                  id="event-conditionValue"
                  type="text"
                  value={field.value}
                  onChange={e => onChange('conditionValue', e.target.value)}
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
              </FormGroup>
            ))}
          </FormGroup>
        </Col>
      </Row>
    </FormGroup>
  );
}
