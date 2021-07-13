/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Stack } from '@instana/components';

import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SmartAlertSelectionList from 'in-alerting/smart-alerts/applications/components/list/SmartAlertSelectionList';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './SelectSmartAlertsDialog.mless';

export default function SelectSmartAlertDialog({ onSubmit, selection: initialSelection }) {
  const [selection, setSelection] = useState(initialSelection ?? []);
  return (
    <DialogWithSlideInView
      title={t('in-settings:tabs.addSmartAlerts')}
      onClose={close}
      footer={
        <div className={locals.footer}>
          <Stack direction="horizontal" align="center" distribution="center">
            <Button type="submit" kind="secondary" onClick={() => close()}>
              {t('in-settings:tabs.cancel')}
            </Button>
            <Button
              type="submit"
              kind="primary"
              onClick={() => onSubmit(selection, close)}
              disabled={!selection.length}
            >
              {t('in-settings:tabs.selectSmartAlerts', { count: selection.length })}
            </Button>
          </Stack>
        </div>
      }
    >
      <div className={locals.dialog}>
        <SmartAlertSelectionList
          selection={selection}
          onChange={setSelection}
          getLocalAlertConfigsFetchFunction={() => getAllAlertConfigsForAllApplications({ asObservable: true })}
          getGlobalAlertConfigFetchFunction={() => getAllGlobalAlertConfigs({ asObservable: true })}
          pageSize={20}
        />
      </div>
    </DialogWithSlideInView>
  );
}

SelectSmartAlertDialog.propTypes = {
  onSubmit: PropTypes.func,
  selection: PropTypes.arrayOf(PropTypes.string)
};
