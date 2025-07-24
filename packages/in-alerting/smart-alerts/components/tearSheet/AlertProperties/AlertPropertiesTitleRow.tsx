/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import { Button, Stack } from '@instana/components';

import { PlaceholderListWithTooltip } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
//@ts-expect-error TS migration
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import { insertPlaceholderText } from 'in-alerting/smart-alerts/utils/alertPropertiesTitleUtils';
//@ts-expect-error TS migrate
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import AlertTypography from 'in-alerting/components/AlertTypography';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { stopPropagation } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow.mless';

export interface AlertPropertiesTitleRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm<any>) => string;
  placeholderData: PlaceholderListWithTooltip;
  showDisabledPlaceholder?: boolean;
  titlePlaceholder?: string;
}
export default function AlertPropertiesTitleRow({
  form,
  onChange,
  getTitlePlaceholder,
  placeholderData,
  showDisabledPlaceholder = false,
  titlePlaceholder
}: AlertPropertiesTitleRowProps) {
  const hasError = !form.get('name').valid && form.get('name').touched;
  const { placeholders } = placeholderData;

  return (
    <Stack gap="xxsmall">
      <div className={locals.alertTitleRowContainer}>
        <label>
          <AlertTypography
            variant="body-regular"
            color="color900"
            content={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
            noMargin
          />
        </label>
        <Stack gap="xxsmall">
          <DebouncedInput
            name="name"
            id="name"
            delay={300}
            hasError={hasError}
            type="text"
            onValueChange={(targetValue: string) => {
              onChange(['name'], field => (field as Field<string>).setValue(targetValue || '').setTouched(true));
            }}
            value={form.get('name').value}
            placeholder={titlePlaceholder ?? getTitlePlaceholder(form)}
          />
          <Stack direction="horizontal" distribution="spaceBetween" align="center">
            <div className={locals.validationMessage}>
              <TouchedMessages field={form.get('name')} className={locals.touchedMessage} />
            </div>
            {((placeholders && placeholders.length > 0) || showDisabledPlaceholder) && (
              <MoreMenu
                renderInteractiveElement={({ ref, toggle }: InteractiveElementsProps) => (
                  <Button
                    kind="action"
                    icon="lib_openclose_add"
                    ref={ref}
                    onClick={e => {
                      stopPropagation(e);
                      toggle();
                    }}
                    size="compact"
                  >
                    {t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertyInsertPlaceholderLabel')}
                  </Button>
                )}
                disabled={placeholders?.length === 0}
              >
                {placeholders?.map(({ template }) => (
                  <MoreMenuButton
                    onClick={insertPlaceholderText(form.get('name').value, template, onChange, 'name')}
                    key={template}
                  >
                    {template}
                  </MoreMenuButton>
                ))}
              </MoreMenu>
            )}
          </Stack>
        </Stack>
      </div>
    </Stack>
  );
}
