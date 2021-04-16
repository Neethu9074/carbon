/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { applicationsAlertingAdditionalPropsTitleChanged } from 'in-alerting/smart-alerts/applications/tracker';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import AlertSection from 'in-alerting/components/AlertSection';
import { stopPropagation } from 'in-services/util/function';
import Button from 'in-new-components/Button/Button';
import Stack from 'in-new-components/layout/Stack';
import { t } from 'in-i18n';

import locals from './ApplicationAlertPropertiesTitleRow.mless';

export const placeholders = Object.freeze({
  applicationName: '${application.name}',
  serviceName: '${service.name}',
  endpointName: '${endpoint.name}'
});

export default function ApplicationAlertPropertiesTitleRow({ form, onChange }) {
  const alertEvaluationType = form.get('evaluationType').value;
  const titleTextareaRef = useRef(null);

  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <Stack space="xsmall">
        <HorizontalFlexWrapper className={locals.placeholderMenuButtonWrapper}>
          <MoreMenu
            renderInteractiveElement={({ buttonClassName, ref, toggle }) => (
              <Button
                kind="action"
                className={classNames(buttonClassName, locals.placeholderMenu)}
                ref={ref}
                onClick={e => {
                  stopPropagation(e);
                  toggle();
                }}
              >
                {t('in-alerting:smartAlerts.applications.advanced.alertPropertyInsertPlaceholderLabel')}
              </Button>
            )}
          >
            {Object.values(placeholders)
              .filter(placeholderSuggestionsFilter(alertEvaluationType))
              .map(placeholderString => (
                <MoreMenuButton
                  onClick={insertPlaceholderText(titleTextareaRef, placeholderString, onChange)}
                  key={placeholderString}
                >
                  {placeholderString}
                </MoreMenuButton>
              ))}
          </MoreMenu>
        </HorizontalFlexWrapper>
        <AlertPropertiesTextarea
          ref={titleTextareaRef}
          name="name"
          id="name"
          value={form.get('name').value}
          onChange={e => {
            onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
            applicationsAlertingAdditionalPropsTitleChanged();
          }}
          hasError={hasError(form.get('name'))}
          maxLength={256}
          placeholder={getTitlePlaceholder(form)}
        />
      </Stack>
    </AlertSection>
  );
}

function placeholderSuggestionsFilter(alertEvaluationType) {
  return placeholder => {
    if (placeholder === placeholders.applicationName) {
      return placeholder;
    }

    if (placeholder === placeholders.endpointName && alertEvaluationType === PER_AP_ENDPOINT) {
      return placeholder;
    }

    if (
      (placeholder === placeholders.serviceName && alertEvaluationType === PER_AP_SERVICE) ||
      alertEvaluationType === PER_AP_ENDPOINT
    ) {
      return placeholder;
    }
  };
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

function hasError(field) {
  return !field.valid && field.touched;
}

ApplicationAlertPropertiesTitleRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.any
};
