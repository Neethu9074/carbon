/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React, { useRef } from 'react';

import { Stack, Button } from '@instana/components';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import { PlaceholderListWithTooltip } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { insertPlaceholderText } from 'in-alerting/smart-alerts/utils/alertPropertiesTitleUtils';
//@ts-expect-error TS migrate
import { MoreMenu, MoreMenuButton } from 'in-components/MoreMenu';
import { InteractiveElementsProps } from 'in-components/MoreMenu/MoreMenu';
import AlertSection from 'in-alerting/components/AlertSection';
import { stopPropagation } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow.mless';

export interface AlertPropertiesTitleRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm<any>) => string;
  placeholderData: PlaceholderListWithTooltip;
  titlePlaceholder?: string;
}
export default function AlertPropertiesTitleRow({
  form,
  onChange,
  getTitlePlaceholder,
  placeholderData,
  titlePlaceholder
}: AlertPropertiesTitleRowProps) {
  const titleTextareaRef = useRef(null);
  const { placeholders } = placeholderData;

  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <Stack gap="xxsmall">
        <AlertPropertiesTextarea
          ref={titleTextareaRef}
          name="name"
          id="name"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(['name'], field => (field as Field<string>).setValue(e.target.value || '').setTouched(true));
          }}
          placeholder={titlePlaceholder ?? getTitlePlaceholder(form)}
          formField={form.get('name')}
        />
        {placeholders.length !== 0 && (
          <HorizontalFlexWrapper className={locals.placeholderMenuButtonWrapper}>
            <MoreMenu
              disabled={placeholders.length === 0}
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
            >
              {placeholders.map(({ template }) => {
                return (
                  <MoreMenuButton
                    onClick={insertPlaceholderText(form.get('name').value, template, onChange, 'name')}
                    key={template}
                  >
                    {template}
                  </MoreMenuButton>
                );
              })}
            </MoreMenu>
          </HorizontalFlexWrapper>
        )}
      </Stack>
    </AlertSection>
  );
}
