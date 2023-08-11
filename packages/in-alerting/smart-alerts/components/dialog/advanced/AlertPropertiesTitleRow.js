/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';
import { Stack } from '@instana/components';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import AlertSection from 'in-alerting/components/AlertSection';
import { stopPropagation } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow.mless';

export default function AlertPropertiesTitleRow({
  form,
  onChange,
  getTitlePlaceholder,
  placeholders,
  trackAlertingAdditionalPropsTitleChanged
}) {
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
              renderInteractiveElement={({ ref, toggle }) => (
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
          onChange={e => {
            onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
            trackAlertingAdditionalPropsTitleChanged?.();
          }}
          placeholder={getTitlePlaceholder(form)}
          formField={form.get('name')}
        />
      </Stack>
    </AlertSection>
  );
}

function insertPlaceholderText(titleTextareaRef, placeholderString, onChange) {
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

    onChange(['name'], field => field.setValue(newValue).setTouched(true));
  };
}

AlertPropertiesTitleRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  getTitlePlaceholder: PropTypes.func.isRequired,
  placeholders: PropTypes.array.isRequired,
  trackAlertingAdditionalPropsTitleChanged: PropTypes.func
};
