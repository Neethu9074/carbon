/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Button } from '@instana/components';

import IndividualEditRightSelection from 'in-custom-dashboards/CustomDashboard/SharingDialog/IndividualEditRightSelection';
import Option from 'in-custom-dashboards/CustomDashboard/SharingDialog/Option';
import { close } from 'in-components/DialogPresenter/store';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './SharingDialogPresenter.mless';

export default function SharingDialogPresenter(props) {
  const { isPrivate, setPrivate, onSubmit, isUsingAdvancedAccessRules } = props;

  return (
    <Dialog
      title={t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.editPermissions')}
      titleIconType="lib_actions_settings_view"
      onClose={close}
      className={locals.dialog}
      closeTooltip={t(
        'in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.tooltipCloseAndCancel'
      )}
    >
      <form onSubmit={onSubmit}>
        {isUsingAdvancedAccessRules && (
          <Message type="neutral" withIcon className={locals.message}>
            {t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.shareMsg')}
          </Message>
        )}

        <Option
          label={t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.privateDashboardDefault')}
          titleIconType="lib_actions_share"
          onClose={close}
          className={locals.dialog}
          explanation={t(
            'in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.privateDashboardDefaultExplain'
          )}
          checked={isPrivate}
          onChange={checked => setPrivate(checked)}
        />
        <Option
          label={t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.publicDashboard')}
          explanation={t(
            'in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.publicDashboardExplain'
          )}
          checked={!isPrivate}
          onChange={checked => setPrivate(!checked)}
        />

        <IndividualEditRightSelection {...props} />

        <Actions>
          <Button onClick={close} kind="secondary" className={locals.button}>
            {t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.cancel')}
          </Button>
          <Button kind="primary" type="submit" className={locals.button}>
            {t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.save')}
          </Button>
        </Actions>
      </form>
    </Dialog>
  );
}
