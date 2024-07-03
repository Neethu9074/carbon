/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import { Button } from '@instana/legacy';

//@ts-expect-error TS migration
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import { Placeholder } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
//@ts-expect-error TS migrate
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { stopPropagation } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/AlertProperties/AlertPropertiesTitleRow.mless';

export interface AlertPropertiesTitleRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm<any>) => string;
  placeholders: ReadonlyArray<Readonly<Placeholder>>;
}
export default function AlertPropertiesTitleRow({
  form,
  onChange,
  getTitlePlaceholder,
  placeholders
}: AlertPropertiesTitleRowProps) {
  return (
    <div className={locals.titleRowContainer}>
      <label>
        <AlertTypography
          variant={'body-regular'}
          color={'color900'}
          content={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
          noMargin
        />
      </label>

      <DebouncedInput
        name="name"
        id="name"
        delay={300}
        type="text"
        onValueChange={(targetValue: string) => {
          onChange(['name'], field => (field as Field<string>).setValue(targetValue || '').setTouched(true));
        }}
        value={form.get('name').value}
        placeholder={getTitlePlaceholder(form)}
        isTearSheet
      />

      {placeholders.length > 0 && (
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
              className={locals.btnWidth100}
            >
              {t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertyInsertPlaceholderLabel')}
            </Button>
          )}
        >
          {placeholders.map(({ template }) => {
            return (
              <MoreMenuButton
                onClick={insertPlaceholderText(form.get('name').value, template, onChange)}
                key={template}
              >
                {template}
              </MoreMenuButton>
            );
          })}
        </MoreMenu>
      )}
    </div>
  );
}

function insertPlaceholderText(
  value: string,
  placeholderString: string,
  onChange: (path: string[], updater: (item: Item) => Item) => void
) {
  return () => {
    const textarea = document.getElementById('name');

    if (!textarea) {
      return;
    }

    var selectionStart = (textarea as any).selectionStart;
    var selectionEnd = (textarea as any).selectionEnd;

    const tilSelectionStart = value.substring(0, selectionStart);
    const fromSelectionEnd = value.substring(selectionEnd);
    const newValue = tilSelectionStart + placeholderString + fromSelectionEnd;

    // we need to set the new value manually (before calling on change and update the form) to be
    // able to place the cursor right after the inserted placehoder
    (textarea as any).value = newValue;

    const newCursorPosition = selectionStart + placeholderString.length;
    (textarea as any).setSelectionRange(newCursorPosition, newCursorPosition);
    setTimeout(() => textarea.focus(), 0);

    onChange(['name'], (field: Item) => (field as Field<string>).setValue(newValue).setTouched(true));
  };
}
