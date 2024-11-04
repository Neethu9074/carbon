/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  automaticallyCloseAfterOptions,
  hostAvailabilityOfflineDurationOptions
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import Helpify from 'in-components/form/Helpify';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function HostAvailabilityFormGroup({ form, onChange, disabled }) {
  const offlineDuration = form.get('offlineDuration');
  const closeAfter = form.get('closeAfter');

  return (
    <>
      <FormGroup>
        <Row withoutTopMargin>
          <Col lg={3}>
            <Label htmlFor="offline-duration" hasError={!offlineDuration.valid && offlineDuration.touched}>
              {t('in-settings:tabs.offlineFor')}
            </Label>
            <ComboBox
              isDisabled={disabled}
              name="offline-duration"
              value={offlineDuration.value}
              options={hostAvailabilityOfflineDurationOptions}
              onChange={e => onChange('offlineDuration', e ? e.value : '')}
              clearable={false}
            />
            <TouchedMessages field={offlineDuration} />
          </Col>
        </Row>
      </FormGroup>
      <FormGroup>
        <Row withoutTopMargin>
          <Col lg={3}>
            <Label htmlFor="automaticallyCloseAfter" hasError={!closeAfter.valid && closeAfter.touched}>
              {t('in-settings:tabs.automaticallyCloseAfter')}
            </Label>
            <Helpify helpText={t('in-settings:tabs.closeAfterHelperDescription')}>
              <ComboBox
                isDisabled={disabled}
                name="automaticallyCloseAfter"
                value={closeAfter.value}
                options={automaticallyCloseAfterOptions}
                onChange={e => onChange('closeAfter', e ? e.value : '')}
                clearable={false}
              />
            </Helpify>
            <TouchedMessages field={closeAfter} />
          </Col>
        </Row>
      </FormGroup>
    </>
  );
}
