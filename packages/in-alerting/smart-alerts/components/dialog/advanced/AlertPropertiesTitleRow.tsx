/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React, { useRef } from 'react';

import { Button } from '@instana/components';
import { Stack } from '@instana/components';

//@ts-expect-error TS migrate
import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import { Placeholder } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
//@ts-expect-error TS migrate
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import AlertSection from 'in-alerting/components/AlertSection';
import { stopPropagation } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow.mless';

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
  const titleTextareaRef = useRef(null);

  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <Stack gap="xsmall">
        {placeholders.length > 0 && (
          <HorizontalFlexWrapper className={locals.placeholderMenuButtonWrapper}>
            <MoreMenu
              renderInteractiveElement={({ ref, toggle }: InteractiveElementsProps) => (
                <Button
                  kind="action"
                  className={locals.placeholderMenu}
                  ref={ref}
                  onClick={e => {
                    stopPropagation(e);
                    toggle();
                  }}
                >
                  {t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertyInsertPlaceholderLabel')}
                </Button>
              )}
            >
              {placeholders.map(({ template }) => {
                return (
                  <MoreMenuButton onClick={insertPlaceholderText(titleTextareaRef, template, onChange)} key={template}>
                    {template}
                  </MoreMenuButton>
                );
              })}
            </MoreMenu>
          </HorizontalFlexWrapper>
        )}
        <AlertPropertiesTextarea
          ref={titleTextareaRef}
          name="name"
          id="name"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(['name'], field => (field as Field<string>).setValue(e.target.value || '').setTouched(true));
          }}
          placeholder={getTitlePlaceholder(form)}
          formField={form.get('name')}
        />
      </Stack>
    </AlertSection>
  );
}

function insertPlaceholderText(
  titleTextareaRef: React.MutableRefObject<HTMLTextAreaElement | null>,
  placeholderString: string,
  onChange: (path: string[], updater: (item: Item) => Item) => void
) {
  return () => {
    const textarea = titleTextareaRef.current;

    if (!textarea) {
      return;
    }

    const { selectionStart, selectionEnd, value } = textarea;

    const tilSelectionStart = value.substring(0, selectionStart);
    const fromSelectionEnd = value.substring(selectionEnd);
    const newValue = tilSelectionStart + placeholderString + fromSelectionEnd;

    // we need to set the new value manually (before calling on change and update the form) to be
    // able to place the cursor right after the inserted placehoder
    textarea.value = newValue;
    const newCursorPosition = selectionStart + placeholderString.length;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    textarea.focus();

    onChange(['name'], (field: Item) => (field as Field<string>).setValue(newValue).setTouched(true));
  };
}
