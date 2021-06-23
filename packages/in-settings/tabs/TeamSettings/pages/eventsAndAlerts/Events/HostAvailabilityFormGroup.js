/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  offlineDurationOptions,
  automaticallyCloseAfterOptions
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/customEventFormUtil';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import Helpify from 'in-components/form/Helpify/Helpify';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

export default function HostAvailabilityFormGroup({ form, onChange }) {
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
              name="offline-duration"
              value={offlineDuration.value}
              options={offlineDurationOptions}
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
