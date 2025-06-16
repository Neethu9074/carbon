/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm, Item } from 'formalistic';
import React from 'react';

import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/synthetics/form/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import { allowedPlaceholders } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
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
          renderAlertPropertiesTitleRow={() => (
            <AlertPropertiesTitleRow
              form={form}
              onChange={onChange}
              getTitlePlaceholder={getTitlePlaceholder}
              placeholderData={{ placeholders: allowedPlaceholders }}
            />
          )}
        />
      )}
      renderAlertPreview={() => {
        const renderHeadline = () => <AlertPreviewHeadline title={getAlertTitle(nameField)} />;
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

export function getAlertTitle(nameField: Field<string>) {
  return nameField?.value
    ? replacePlaceholdersWithMarkup(allowedPlaceholders, nameField?.value ?? '', ({ name }) => name)
    : getTitlePlaceholder();
}
