import React, { useState } from 'react';
import theme from 'in-themes';

import {
  websitesAlertingAlertRevisionChanged,
  websitesAlertingAlertDeleted,
  websitesAlertingAlertPaused,
  websitesAlertingAlertResumed
} from 'in-websites/eum-alerting/tracker';
import { disableAlertConfig, enableAlertConfig, deleteAlertConfig } from 'in-websites/api/websiteAlertConfig';
import RevisionDropdown from 'in-websites/WebsiteDashboard/tabs/Alerts/RevisionDropdown';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getLinkToAlerts } from 'in-websites/navigation/paths';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { mutateUrl } from 'in-stores/navigation/navigation';
import Message from 'in-new-components/Message/Message';
import BackButton from 'in-new-components/BackButton';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Button from 'in-new-components/Button';
import Pill from 'in-new-components/Pill';

import alertsLocals from './Alerts.mless';
import locals from './AlertHeader.mless';

export default function AlertHeader({ alertConfig, alertConfigVersions, setRevision, openDialog }) {
  const alertRevision = getRevision(alertConfig, alertConfigVersions) || 1;
  const isDeletedConfig = alertConfig.readOnly && alertRevision === alertConfigVersions.length;
  const isNotLatestRevision = alertRevision < alertConfigVersions.length;

  const [errorMessage, setErrorMessage] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div>
      <BackButton label="Back to list of alerts" href$={getLinkToAlerts()} withoutMargin />

      {errorMessage && (
        <TemporaryMessage id={errorMessage} message={errorMessage} type="error" onHide={() => setErrorMessage(null)} />
      )}

      <div className={locals.labelWrapper}>
        <div className={locals.left}>
          <SvgIcon
            className={evaluateClassNames({
              [locals.alertIcon]: true,
              [alertsLocals.alertIconSeverityLow]: alertConfig.severity <= 5,
              [alertsLocals.alertIconSeverityHigh]: alertConfig.severity > 5
            })}
            size="l"
            type="lib_alerts_alert"
          />
          <div className={locals.name}>{alertConfig.name}</div>
        </div>

        <div className={locals.right}>
          <Pill className={locals.badge} color={theme.lib.colors.purple800} kind="light">
            Alert
          </Pill>

          {alertConfigVersions.length > 1 && (
            <RevisionDropdown
              alertConfig={alertConfig}
              alertConfigVersions={alertConfigVersions}
              setRevision={revision => {
                setRevision(revision);
                websitesAlertingAlertRevisionChanged(revision);
              }}
              alertRevision={alertRevision}
            />
          )}

          {!alertConfig.readOnly && (
            <>
              <SvgIcon
                className={locals.actionIcon}
                type={
                  isToggling ? 'lib_actions_loading' : alertConfig.enabled ? 'lib_actions_pause' : 'lib_actions_play'
                }
                spinning={isToggling}
                onClick={() => {
                  if (!isToggling) {
                    doToggleEnabled(alertConfig, setIsToggling, setRevision, setErrorMessage);
                  }
                }}
              />

              <SvgIcon className={locals.actionIcon} type="lib_actions_edit" onClick={openDialog} />

              <SvgIcon
                className={locals.actionIcon}
                type={isDeleting ? 'lib_actions_loading' : 'lib_actions_delete'}
                spinning={isDeleting}
                onClick={() => {
                  if (!isDeleting) {
                    setActiveDialog(
                      <ConfirmationDialog
                        header="Please Confirm"
                        description={
                          <span>
                            Are you sure you want to remove the <strong>alert</strong>?
                          </span>
                        }
                        bButtonLabel="Remove"
                        onB={() => {
                          close();
                          doDelete(alertConfig, setIsDeleting, setErrorMessage);
                        }}
                        bButtonIcon="lib_actions_delete"
                      />
                    );
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
      {isDeletedConfig && (
        <Message iconColor={theme.lib.colors.failure} withIcon type="neutral">
          You are looking at a deleted alert configuration. Modifications are not possible.
        </Message>
      )}
      {isNotLatestRevision && (
        <Message withIcon type="neutral">
          You are looking at revision {`${alertRevision}`} of this alert configuration. Please select the
          <Button className={locals.latestButton} kind="action" onClick={() => setRevision({ id: alertConfig.id })}>
            latest revision
          </Button>
          if you want to make changes.
        </Message>
      )}
    </div>
  );
}

function doToggleEnabled(config, setIsToggling, setRevision, setErrorMessage) {
  setIsToggling(true);

  const toggle$ = config.enabled ? disableAlertConfig(config.id) : enableAlertConfig(config.id);

  toggle$.once(() => {
    setIsToggling(false);

    if (config.enabled) {
      websitesAlertingAlertPaused(config.id);
    } else {
      websitesAlertingAlertResumed(config.id);
    }
    // setting the revision will cause a reload of the page. a missing created data will fetch the newest version
    setRevision({ id: config.id });
  });

  toggle$.errors().once(error => {
    setIsToggling(false);

    const errorMessage = `Failed to ${config.enabled ? 'disable' : 'enable'} alert config with ID ${config.id}: ${
      error.message
    }`;
    setErrorMessage(errorMessage);
  });
}

function doDelete(config, setIsDeleting, setErrorMessage) {
  setIsDeleting(true);
  const deletion$ = deleteAlertConfig(config.id);

  deletion$.once(() => {
    websitesAlertingAlertDeleted(config.id);
    mutateUrl(location => {
      location.pathname = `${websitePathFullyQualified}/alerts`;
    });
  });
  deletion$.errors().once(error => {
    setIsDeleting(false);
    const errorMessage = `Failed to remove alert config with ID ${config.id}: ${error.message}`;
    setErrorMessage(errorMessage);
  });
}

// export for test
export function getRevision(alertConfig, alertConfigVersions) {
  for (let i = 0; i < alertConfigVersions.length; i++) {
    if (alertConfig.created === alertConfigVersions[i].created) {
      return toAlertRevision(i, alertConfigVersions);
    }
  }
  return alertConfigVersions.length;
}

function toAlertRevision(i, alertConfigVersions) {
  return alertConfigVersions.length - i;
}
