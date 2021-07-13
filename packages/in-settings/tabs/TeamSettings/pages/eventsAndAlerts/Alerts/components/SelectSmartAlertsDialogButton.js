/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import { List } from 'immutable';
import React from 'react';

import { Button } from '@instana/components';

import SelectSmartAlertDialog from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/SelectSmartAlertDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './SelectSmartAlertsDialogButton.mless';

export default function SelectSmartAlertsDialogButton({ form, updateForm }) {
  const label = t('in-settings:tabs.addSmartAlerts');
  const selection = form.get('applicationAlertConfigIds')?.value.toJS();
  return (
    <Button
      kind="action"
      icon="lib_openclose_add_circle_outline"
      title={label}
      onClick={() =>
        addActiveDialog(
          <SelectSmartAlertDialog
            selection={selection}
            onSubmit={(s, close) => {
              updateForm(form.updateIn(['applicationAlertConfigIds'], f => f.setValue(List(s)).setTouched(true)));
              close();
            }}
          />
        )
      }
      className={locals.selectButton}
    >
      {label}
    </Button>
  );
}

SelectSmartAlertsDialogButton.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
