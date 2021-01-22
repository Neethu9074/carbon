/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import RevisionDropdown, { toAlertRevision } from 'in-new-components/Alerting/components/RevisionDropdown';
import { isQB2Config, isQB2ModeEnabled } from 'in-new-components/Alerting/components/WithQB1orQB2';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { warning } from 'in-new-components/Message/types';
import BackButton from 'in-new-components/BackButton';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import { role } from 'in-stores/user';

import locals from './AlertHeader.mless';

export default function AlertHeader({
  alertConfig,
  alertConfigVersions,
  setRevision,
  openDialog,
  fullyQualifiedAlertsList,
  doEnableConfig$,
  doDisableConfig$,
  doDeleteConfig$,
  doRestoreConfig$,
  onConfigStateChanged,
  onConfigDeleted,
  onConfigRevisionChanged
}) {
  const alertRevision = getRevision(alertConfig, alertConfigVersions) || 1;

  const isDeletedConfig = alertConfig.readOnly && alertRevision === alertConfigVersions.length;
  const isNotLatestRevision = alertRevision < alertConfigVersions.length;

  const [errorMessage, setErrorMessage] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const doToggleEnabled = () => {
    setIsToggling(true);

    const toggle$ = alertConfig.enabled ? doDisableConfig$(alertConfig.id) : doEnableConfig$(alertConfig.id);

    toggle$.once(() => {
      setIsToggling(false);
      if (onConfigStateChanged) {
        onConfigStateChanged(alertConfig.id, alertConfig.enabled);
      }

      // setting the revision will cause a reload of the page. a missing created data will fetch the newest version
      setRevision(null);
    });

    toggle$.errors().once(error => {
      setIsToggling(false);

      const errorMessage = alertConfig.enabled
        ? t('in-new-components:alerting.components.alertHeaderToggleDisableErrorMessage', {
            alertConfigID: alertConfig.id,
            errorMessage: error.message
          })
        : t('in-new-components:alerting.components.alertHeaderToggleEnableErrorMessage', {
            alertConfigID: alertConfig.id,
            errorMessage: error.message
          });
      setErrorMessage(errorMessage);
    });
  };

  const doDelete = () => {
    setIsDeleting(true);
    const deletion$ = doDeleteConfig$(alertConfig.id);

    deletion$.once(() => {
      if (onConfigDeleted) {
        onConfigDeleted({ alertConfigId: alertConfig.id });
      }
      mutateUrl(location => {
        location.pathname = fullyQualifiedAlertsList;
      });
    });
    deletion$.errors().once(error => {
      setIsDeleting(false);
      const errorMessage = t('in-new-components:alerting.components.alertHeaderDeleteErrorMessage', {
        alertConfigID: alertConfig.id,
        errorMessage: error.message
      });
      setErrorMessage(errorMessage);
    });
  };

  const doRestore = () => {
    doRestoreConfig$(alertConfig, alertConfig.id).once(
      () => setRevision(null),
      error => {
        const errorMessage = t('in-new-components:alerting.components.alertHeaderRestoreErrorMessage', {
          alertConfigID: alertConfig.id,
          alertConfigCreated: alertConfig.created,
          errorMessage: error.message
        });
        setErrorMessage(errorMessage);
      }
    );
  };

  return (
    <div>
      <BackButton
        label={t('in-new-components:alerting.components.alertHeaderLabelBackToListOfAlerts')}
        href$={getLinkToAlerts(fullyQualifiedAlertsList)}
        withoutMargin
      />

      {errorMessage && (
        <TemporaryMessage id={errorMessage} message={errorMessage} type="error" onHide={() => setErrorMessage(null)} />
      )}

      <div className={locals.labelWrapper}>
        <div className={locals.left}>
          <SvgIcon
            className={classNames({
              [locals.alertIcon]: true,
              [locals.alertIconSeverityLow]: alertConfig.severity <= 5,
              [locals.alertIconSeverityHigh]: alertConfig.severity > 5
            })}
            size="l"
            type="lib_alerts_alert"
          />
          <div className={locals.name}>{alertConfig.name}</div>
        </div>

        <div className={locals.right}>
          <Pill className={locals.badge} color={theme.lib.colors.purple800} kind="light">
            {t('in-new-components:alerting.components.alertHeaderAlert')}
          </Pill>

          {alertConfigVersions.length > 1 && (
            <RevisionDropdown
              alertConfig={alertConfig}
              alertConfigVersions={alertConfigVersions}
              setRevision={revision => {
                setRevision(revision);
                if (onConfigRevisionChanged) {
                  onConfigRevisionChanged({ revision });
                }
              }}
              alertRevision={alertRevision}
            />
          )}

          {alertConfig.readOnly && !isDeletedConfig && (
            <Tooltip
              content={t('in-new-components:alerting.components.alertHeaderRestoreRevisionTooltip', {
                alertRevision: alertRevision
              })}
            >
              <SvgIcon
                className={locals.actionIcon}
                type="lib_actions_revert"
                onClick={() => {
                  addActiveDialog(
                    <ConfirmationDialog
                      header={t(
                        'in-new-components:alerting.components.alertHeaderRestoreRevisionConfirmationDialogHeader'
                      )}
                      description={
                        <span>
                          {t(
                            'in-new-components:alerting.components.alertHeaderRestoreRevisionConfirmationDialogDescription',
                            { alertRevision: alertRevision }
                          )}
                        </span>
                      }
                      confirmButtonLabel={t(
                        'in-new-components:alerting.components.alertHeaderRestoreRevisionConfirmationDialogConfirmButton'
                      )}
                      onSubmit={() => {
                        close();
                        doRestore();
                      }}
                    />
                  );
                }}
              />
            </Tooltip>
          )}

          {role.canConfigureCustomAlerts && !alertConfig.readOnly && (
            <>
              <Tooltip
                content={
                  alertConfig.enabled
                    ? t('in-new-components:alerting.components.alertHeaderDisableTooltip')
                    : t('in-new-components:alerting.components.alertHeaderEnableTooltip')
                }
              >
                <SvgIcon
                  className={locals.actionIcon}
                  type={
                    isToggling ? 'lib_actions_loading' : alertConfig.enabled ? 'lib_actions_pause' : 'lib_actions_play'
                  }
                  spinning={isToggling}
                  onClick={() => {
                    if (!isToggling) {
                      doToggleEnabled();
                    }
                  }}
                />
              </Tooltip>
              <EditButton
                openDialog={openDialog}
                convertedTagFilterExpression={alertConfig.convertedTagFilterExpression}
              />
              <Tooltip content={`Delete`}>
                <SvgIcon
                  className={locals.actionIcon}
                  type={isDeleting ? 'lib_actions_loading' : 'lib_actions_delete'}
                  spinning={isDeleting}
                  onClick={() => {
                    if (!isDeleting) {
                      addActiveDialog(
                        <ConfirmationDialog
                          header="Please Confirm"
                          description={
                            <span>
                              {t(
                                'in-new-components:alerting.components.alertHeaderRestoreRevisionConfirmationDialogDescription',
                                { alertConfigName: alertConfig.name }
                              )}
                            </span>
                          }
                          confirmButtonLabel="Remove"
                          onSubmit={() => {
                            close();
                            doDelete();
                          }}
                        />
                      );
                    }
                  }}
                />
              </Tooltip>
            </>
          )}
        </div>
      </div>
      {isDeletedConfig && (
        <Message
          type={warning}
          withIcon
          className={locals.bottomSpace}
          title="You are looking at a deleted alert configuration. Modifications are not possible."
        />
      )}
      {isNotLatestRevision && (
        <Message withIcon className={locals.bottomSpace}>
          <Trans
            i18nKey="in-new-components:alerting.components.alertHeaderIsNotLatestRevisionMessage"
            values={{ alertRevision: alertRevision }}
            components={{
              latestRevisionButton: (
                <Button className={locals.latestButton} kind="action" onClick={() => setRevision(null)} />
              )
            }}
          />
        </Message>
      )}
    </div>
  );
}

AlertHeader.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  alertConfigVersions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRevision: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  fullyQualifiedAlertsList: PropTypes.string.isRequired,
  doEnableConfig$: PropTypes.func.isRequired,
  doDisableConfig$: PropTypes.func.isRequired,
  doDeleteConfig$: PropTypes.func.isRequired,
  doRestoreConfig$: PropTypes.func.isRequired,
  onConfigStateChanged: PropTypes.func,
  onConfigDeleted: PropTypes.func,
  onConfigRevisionChanged: PropTypes.func
};

function EditButton({ openDialog, convertedTagFilterExpression }) {
  const isQB1Mode = !isQB2ModeEnabled;
  const isDisabled = isQB2Config(convertedTagFilterExpression) && isQB1Mode;
  return (
    <Tooltip
      content={
        isDisabled && (
          <div>
            {t('in-new-components:alerting.components.alertHeaderThisConfigIsStoredWithQueryBuilder2Expressions')}
            <br />
            {t('in-new-components:alerting.components.alertHeaderYouCanOnlyStartOrPause')}
          </div>
        )
      }
    >
      <SvgIcon
        className={classNames({
          [locals.actionIcon]: true,
          [locals.actionIconDisabled]: isDisabled
        })}
        type="lib_actions_edit"
        onClick={isDisabled ? undefined : openDialog}
      />
    </Tooltip>
  );
}

function getLinkToAlerts(fullyQualifiedAlertsList) {
  return getModifiedUrlStream(params => {
    params.pathname = fullyQualifiedAlertsList;
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
