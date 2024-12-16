/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React, { useRef } from 'react';

import { Stack, SvgIcon, Button } from '@instana/components';
import { themes } from '@instana/design-tokens';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import { Placeholder } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
//@ts-expect-error TS migrate
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import AlertSection from 'in-alerting/components/AlertSection';
import { stopPropagation } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow.mless';

export interface AlertPropertiesTitleRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm<any>) => string;
  placeholders: ReadonlyArray<Readonly<Placeholder>>;
  placeholderTooltipContent?: string | undefined;
}
export default function AlertPropertiesTitleRow({
  form,
  onChange,
  getTitlePlaceholder,
  placeholders,
  placeholderTooltipContent
}: AlertPropertiesTitleRowProps) {
  const titleTextareaRef = useRef(null);
  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <Stack gap="xsmall">
        <HorizontalFlexWrapper className={locals.placeholderMenuButtonWrapper}>
          <MoreMenu
            disabled={placeholders.length === 0}
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
                <MoreMenuButton
                  onClick={insertPlaceholderText(form.get('name').value, template, onChange)}
                  key={template}
                >
                  {template}
                </MoreMenuButton>
              );
            })}
          </MoreMenu>
          {placeholderTooltipContent && (
            <Tooltip align="bottomMiddle" content={placeholderTooltipContent}>
              <SvgIcon
                type="lib_help_error_info_outline"
                size="s"
                color={themes.default.ids.color.option.neutral['700']}
              />
            </Tooltip>
          )}
        </HorizontalFlexWrapper>
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
    // able to place the cursor right after the inserted placeholder
    (textarea as any).value = newValue;

    const newCursorPosition = selectionStart + placeholderString.length;
    (textarea as any).setSelectionRange(newCursorPosition, newCursorPosition);
    setTimeout(() => textarea.focus(), 0);

    onChange(['name'], (field: Item) => (field as Field<string>).setValue(newValue).setTouched(true));
  };
}
