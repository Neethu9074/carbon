/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

// @ts-expect-error needs migration
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
// @ts-expect-error needs migration
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import { t } from 'in-i18n';

interface AlertPropertiesProp {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function SyntheticsAlertProperties(props: AlertPropertiesProp) {
  const { form, onChange } = props;
  const nameField = form.get('name') as Field<string>;
  return (
    <AlertPropertiesContainer
      renderAlertProperties={() => (
        <AlertProperties
          form={form}
          onChange={onChange}
          getDescriptionPlaceholder={getDescriptionPlaceholder}
          renderAlertPopertiesTitleRow={() => (
            <AlertPropertiesTitleRow
              form={form}
              onChange={onChange}
              getTitlePlaceholder={getTitlePlaceholder}
              placeholders={[]}
            />
          )}
        />
      )}
      renderAlertPreview={() => {
        const renderHeadline = () => <AlertPreviewHeadline title={nameField?.value || getTitlePlaceholder()} />;
        return (
          <AlertPreview
            form={form}
            renderHeadline={renderHeadline}
            getDescriptionPlaceholder={getDescriptionPlaceholder}
            entityLabel={t('in-alerting:smartAlerts.synthetics.alertProperties.testName')}
            entityIconType="lib_synthetic"
            entityLabel2={t('in-alerting:smartAlerts.synthetics.alertProperties.locationName')}
            entityIconType2="lib_synthetic_location"
          />
        );
      }}
    />
  );
}
