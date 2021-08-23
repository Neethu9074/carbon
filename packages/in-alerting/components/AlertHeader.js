/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Message, Spacer } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import { extendAlertConfigVersions } from 'in-alerting/components/configVersionsEnrichment';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import RevisionDropdown from 'in-alerting/components/RevisionDropdown';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation';
import IconButton from 'in-components/IconButton/IconButton';
import BackButton from 'in-components/BackButton';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import locals from 'in-alerting/components/AlertHeader.mless';

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
  onConfigRevisionChanged,
  renderCustomTitle
}) {
  const extendedAlertConfigVersions = extendAlertConfigVersions(alertConfigVersions);

  const alertRevision =
    extendedAlertConfigVersions.find(({ created }) => alertConfig.created === created) ?? alertConfig;
  const isDeletedConfig = extendedAlertConfigVersions.some(alertConfig => alertConfig.deleted);
  const isNotLatestRevision = alertRevision.created < extendedAlertConfigVersions[0].created;

  const [errorMessage, setErrorMessage] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

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
        ? t('in-alerting:components.alertHeaderToggleDisableErrorMessage', {
            alertConfigID: alertConfig.id,
            errorMessage: error.message
          })
        : t('in-alerting:components.alertHeaderToggleEnableErrorMessage', {
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
      const errorMessage = t('in-alerting:components.alertHeaderDeleteErrorMessage', {
        alertConfigID: alertConfig.id,
        errorMessage: error.message
      });
      setErrorMessage(errorMessage);
    });
  };

  const doRestore = () => {
    setIsRestoring(true);
    doRestoreConfig$(alertConfig.created, alertConfig.id).once(
      () => {
        setRevision(null);
        setIsRestoring(false);
      },
      error => {
        const errorMessage = t('in-alerting:components.alertHeaderRestoreErrorMessage', {
          alertConfigID: alertConfig.id,
          alertConfigCreated: alertConfig.created,
          errorMessage: error.message
        });
        setErrorMessage(errorMessage);
        setIsRestoring(false);
      }
    );
  };

  return (
    <div>
      <BackButton
        label={t('in-alerting:components.alertHeaderLabelBackToListOfAlerts')}
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
            aria-label={t('in-alerting:components.alertHeaderAriaLabelSeverity', {
              severity: alertConfig.severity <= 5 ? 'low' : 'high'
            })}
          />
          <div className={locals.name}>{renderCustomTitle?.() ?? alertConfig.name}</div>
        </div>

        <div className={locals.right}>
          <Pill className={locals.badge} color={theme.lib.colors.purple800} kind="light">
            {t('in-alerting:components.alertHeaderAlert')}
          </Pill>

          {extendedAlertConfigVersions.length > 1 && (
            <>
              <RevisionDropdown
                alertConfigVersions={extendedAlertConfigVersions}
                alertRevision={alertRevision}
                setRevision={revision => {
                  setRevision(revision);
                  if (onConfigRevisionChanged) {
                    onConfigRevisionChanged({ revision });
                  }
                }}
              />
              <Spacer horizontal="normal" />
            </>
          )}

          {alertConfig.readOnly && !isDeletedConfig && (
            <Tooltip
              content={t('in-alerting:components.alertHeaderRestoreRevisionTooltip', {
                description: alertRevision.description
              })}
            >
              <IconButton
                kind="primaryv2"
                type="lib_actions_revert"
                iconSpinning={isRestoring}
                onClick={() => openRestoreConfirmationDialog(alertRevision, doRestore)}
                alignment="right"
              />
            </Tooltip>
          )}

          {role.canConfigureCustomAlerts && !alertConfig.readOnly && (
            <>
              <Tooltip
                content={
                  alertConfig.enabled
                    ? t('in-alerting:components.alertHeaderDisableTooltip')
                    : t('in-alerting:components.alertHeaderEnableTooltip')
                }
              >
                <IconButton
                  kind="primaryv2"
                  type={
                    isToggling ? 'lib_actions_loading' : alertConfig.enabled ? 'lib_actions_pause' : 'lib_actions_play'
                  }
                  spinning={isToggling}
                  onClick={() => {
                    if (!isToggling) {
                      doToggleEnabled();
                    }
                  }}
                  alignment="right"
                />
              </Tooltip>
              <Tooltip content={t('in-alerting:components.alertHeaderEditTooltip')}>
                <IconButton alignment="right" kind="primaryv2" type="lib_actions_edit" onClick={openDialog} />
              </Tooltip>
              <Tooltip content={t('in-alerting:components.alertHeaderDuplicateTooltip')}>
                <IconButton
                  kind="primaryv2"
                  type="lib_actions_copy"
                  onClick={() => openDialog({ isCopy: true })}
                  alignment="right"
                />
              </Tooltip>
              {!alertConfig?.builtIn && (
                <Tooltip content={t('in-alerting:components.alertHeaderRestoreDeleteTooltip')}>
                  <IconButton
                    kind="primaryv2"
                    type={isDeleting ? 'lib_actions_loading' : 'lib_actions_delete'}
                    spinning={isDeleting}
                    onClick={() => {
                      if (!isDeleting) {
                        addActiveDialog(
                          <ConfirmationDialog
                            header={t('in-alerting:components.alertHeaderRestoreDeleteConfirmationDialogHeader')}
                            description={
                              <Trans
                                i18nKey="in-alerting:components.alertHeaderRestoreDeleteConfirmationDialogDescription"
                                values={{ alertConfigName: alertConfig.name }}
                              />
                            }
                            confirmButtonLabel={t(
                              'in-alerting:components.alertHeaderRestoreDeleteConfirmationDialogConfirmButton'
                            )}
                            onSubmit={() => {
                              close();
                              doDelete();
                            }}
                          />
                        );
                      }
                    }}
                    alignment="right"
                  />
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
      {isDeletedConfig && (
        <Message
          type="warning"
          withIcon
          className={locals.bottomSpace}
          title={t(
            'in-alerting:components.alertHeaderYouAreLookingAtADeletedAlertConfigurationModificationsAreNotPossible'
          )}
        />
      )}
      {isNotLatestRevision && (
        <Message withIcon className={locals.bottomSpace}>
          <Trans
            i18nKey="in-alerting:components.alertHeaderIsNotLatestRevisionMessage"
            values={{ description: alertRevision.description }}
            components={{
              latestRevisionButton: (
                <Button className={locals.latestButton} kind="action" onClick={() => setRevision(null)} noAutoMargin>
                  {null /* Children will be injected via react i18n */}
                </Button>
              ),
              restoreRevisionButton: (
                <Button
                  className={locals.latestButton}
                  kind="action"
                  onClick={() => openRestoreConfirmationDialog(alertRevision, doRestore)}
                  noAutoMargin
                >
                  {null /* Children will be injected via react i18n */}
                </Button>
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
  alertConfigVersions: PropTypes.arrayOf(
    PropTypes.shape({
      deleted: PropTypes.bool,
      created: PropTypes.number,
      changeType: PropTypes.string,
      author: PropTypes.object
    })
  ).isRequired,
  setRevision: PropTypes.func.isRequired,
  openDialog: PropTypes.func.isRequired,
  fullyQualifiedAlertsList: PropTypes.string.isRequired,
  doEnableConfig$: PropTypes.func.isRequired,
  doDisableConfig$: PropTypes.func.isRequired,
  doDeleteConfig$: PropTypes.func.isRequired,
  doRestoreConfig$: PropTypes.func.isRequired,
  onConfigStateChanged: PropTypes.func,
  onConfigDeleted: PropTypes.func,
  onConfigRevisionChanged: PropTypes.func,
  renderCustomTitle: PropTypes.func
};

function openRestoreConfirmationDialog(alertRevision, doRestore) {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogHeader')}
      description={
        <Trans
          i18nKey="in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogDescription"
          values={{ alertRevision: alertRevision }}
        />
      }
      confirmButtonLabel={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogConfirmButton')}
      onSubmit={() => {
        close();
        doRestore();
      }}
    />
  );
}

function getLinkToAlerts(fullyQualifiedAlertsList) {
  return getModifiedUrlStream(params => {
    params.pathname = fullyQualifiedAlertsList;
  });
}

// export for test
export function getRevision(alertConfig, extendedAlertConfigVersions) {
  return extendedAlertConfigVersions.find(({ created }) => alertConfig.created === created) ?? alertConfig;
}
