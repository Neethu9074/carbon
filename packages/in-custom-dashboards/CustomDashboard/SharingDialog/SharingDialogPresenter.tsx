/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React, { FormEventHandler } from 'react';

import { Message, Button, RadioButton, Stack } from '@instana/components';

import IndividualEditRightSelection from 'in-custom-dashboards/CustomDashboard/SharingDialog/IndividualEditRightSelection';
import { close } from 'in-components/DialogPresenter/store';
import { AccessRule, Result, UserResult } from 'in-types';
import Actions from 'in-components/Dialog/Actions';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './SharingDialogPresenter.mless';

interface SharingDialogPresenterProps {
  isPrivate: boolean;
  setPrivate: (val: boolean) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isUsingAdvancedAccessRules: boolean;
  userIsDashboardOwner: boolean;
  usersResult: Result<UserResult[]> | null | undefined;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  addEditor: () => void;
  removeEditor: () => void;
  accessRules: AccessRule[];
  changesMade: boolean;
}

export default function SharingDialogPresenter(props: SharingDialogPresenterProps) {
  const { isPrivate, setPrivate, onSubmit, isUsingAdvancedAccessRules, userIsDashboardOwner, changesMade } = props;

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

        <Stack>
          <RadioButton
            labelClassName={locals.checkboxLabel}
            label={t(
              'in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.privateDashboardDefault'
            )}
            explanation={t(
              'in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.privateDashboardDefaultExplain'
            )}
            checked={isPrivate}
            onChange={checked => setPrivate(checked.target.checked)}
            disabled={!userIsDashboardOwner}
          />
          <RadioButton
            labelClassName={locals.checkboxLabel}
            label={t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.publicDashboard')}
            explanation={t(
              'in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.publicDashboardExplain'
            )}
            checked={!isPrivate}
            onChange={checked => setPrivate(!checked.target.checked)}
          />
        </Stack>
        <IndividualEditRightSelection {...props} />

        <Actions>
          <Button onClick={close} kind="secondary" className={locals.button}>
            {t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.cancel')}
          </Button>
          <Button kind="primary" type="submit" className={locals.button} disabled={!changesMade}>
            {t('in-custom-dashboards:customDashboard.sharingDialog.sharingDialogPresenter.save')}
          </Button>
        </Actions>
      </form>
    </Dialog>
  );
}
