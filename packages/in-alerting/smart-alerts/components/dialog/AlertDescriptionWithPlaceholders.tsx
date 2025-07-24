/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import { insertPlaceholderText } from 'in-alerting/smart-alerts/utils/alertPropertiesTitleUtils';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import { stopPropagation } from 'in-services/util/function';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { t } from 'in-i18n';

interface Placeholder {
  template: string;
}

interface RenderInsertPlaceholderProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (field: Item) => Item) => void;
  placeholders: ReadonlyArray<Readonly<Placeholder>>;
}

export function RenderInsertPlaceholder({ form, onChange, placeholders = [] }: RenderInsertPlaceholderProps) {
  return (
    <MoreMenu
      renderInteractiveElement={({ ref, toggle }) => (
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
      disabled={placeholders.length === 0}
    >
      {placeholders.map(({ template }) => (
        <MoreMenuButton
          key={template}
          onClick={insertPlaceholderText(form.get('description').value, template, onChange, 'description')}
        >
          {template}
        </MoreMenuButton>
      ))}
    </MoreMenu>
  );
}
