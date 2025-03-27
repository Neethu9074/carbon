/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Message, Spacer, Pill, IconButton, Button } from '@instana/components';

import { extendAlertConfigVersions } from 'in-alerting/components/configVersionsEnrichment';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessage';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import RevisionDropdown from 'in-alerting/components/RevisionDropdown';
import { playwithEnabled } from 'in-services/featureFlags';
import AlertIcon from 'in-alerting/components/AlertIcon';
import BackButton from 'in-components/BackButton';
import Tooltip from 'in-components/Tooltip';
import { Trans, t } from 'in-i18n';

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
  renderCustomTitle,
  showActionButton,
  allowActionButtons = true,
  onConfigDeleteTrigger,
  displayEditAction,
  displayTearSheetActions,
  getLinkToEditOrDuplicateSmartAlertTearSheet,
  displayDuplicateAction,
  isGlobalSmartAlert = false,
  hideAlertIcon = false,
  alertDisplayMode,
  openSelectorDialog,
  openTearSheet
}) {
  const { goToPath, createHrefToPath } = useNavigation();
  const extendedAlertConfigVersions = extendAlertConfigVersions(alertConfigVersions);

  //TODO remove displayTearSheetActions , once its implemented in all SA
  const duplicateSmartAlertPath =
    (displayTearSheetActions || alertDisplayMode === FULLSCREEN || alertDisplayMode === CHOICE_DIALOG) &&
    getLinkToEditOrDuplicateSmartAlertTearSheet({
      isGlobal: isGlobalSmartAlert,
      alertId: alertConfig.id,
      alertConfigCreated: alertConfig.created,
      duplicateMode: true
    });

  const alertRevision =
    extendedAlertConfigVersions.find(({ created }) => alertConfig.created === created) ?? alertConfig;
  const isLatestVersionDeleted =
    extendedAlertConfigVersions.length > 0 && extendedAlertConfigVersions[0].changeSummary.changeType === 'DELETE';
  const isNotLatestRevision = alertRevision.created < extendedAlertConfigVersions[0].created;

  const [errorMessage, setErrorMessage] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  //TODO remove displayTearSheetActions , once its implemented in all SA
  const editSmartAlertPath =
    (displayTearSheetActions || alertDisplayMode === FULLSCREEN || alertDisplayMode === CHOICE_DIALOG) &&
    getLinkToEditOrDuplicateSmartAlertTearSheet({
      isGlobal: isGlobalSmartAlert,
      alertId: alertConfig.id,
      alertConfigCreated: alertConfig.created,
      editMode: true
    });
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
      goToPath(fullyQualifiedAlertsList);
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
    doRestoreConfig$(alertConfig.id, alertConfig.created).once(
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

  function getIcon(isToggling, enabled) {
    if (isToggling) {
      return 'lib_actions_loading';
    } else if (enabled) {
      return 'lib_actions_pause';
    } else {
      return 'lib_actions_play';
    }
  }

  return (
    <div>
      <BackButton
        label={t('in-alerting:components.alertHeaderLabelBackToListOfAlerts')}
        href={createHrefToPath(fullyQualifiedAlertsList)}
        withoutMargin
      />

      {errorMessage && (
        <TemporaryMessage id={errorMessage} message={errorMessage} type="error" onHide={() => setErrorMessage(null)} />
      )}

      <div className={locals.labelWrapper}>
        <div className={locals.left}>
          {!hideAlertIcon && <AlertIcon severity={alertConfig.severity} enabled={alertConfig.enabled} size="l" />}
          <div className={locals.name}>{renderCustomTitle?.() ?? alertConfig.name}</div>
        </div>

        <div className={locals.right}>
          <Pill className={locals.badge} type="purple" kind="light">
            {t('in-alerting:components.alertHeaderAlert')}
          </Pill>
          {extendedAlertConfigVersions.length > 0 && (
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
          {allowActionButtons && alertConfig.readOnly && !playwithEnabled && (
            <Tooltip content={t('in-alerting:components.alertHeaderRestoreRevisionTooltip')}>
              <IconButton
                kind="primaryv2"
                data-testid="restroreConfigButton"
                type="lib_actions_revert"
                iconSpinning={isRestoring}
                onClick={() => openRestoreConfirmationDialog(alertRevision, doRestore)}
                alignment="right"
              />
            </Tooltip>
          )}

          {allowActionButtons && !alertConfig.readOnly && showActionButton && !playwithEnabled && (
            <div className={locals.iconsContainer}>
              <Tooltip
                content={
                  alertConfig.enabled ? t('in-alerting:smartAlerts.disable') : t('in-alerting:smartAlerts.enable')
                }
                delay={500}
              >
                <IconButton
                  kind="primaryv2"
                  data-testid="statusToggleButton"
                  type={getIcon(isToggling, alertConfig.enabled)}
                  iconSpinning={isToggling}
                  onClick={() => {
                    if (!isToggling) {
                      doToggleEnabled();
                    }
                  }}
                  alignment="right"
                />
              </Tooltip>
              {displayEditAction && (
                <Tooltip content={t('in-alerting:components.alertHeaderEditTooltip')} delay={500}>
                  <IconButton
                    data-testid="editConfigButton"
                    alignment="right"
                    kind="primaryv2"
                    type="lib_actions_edit"
                    onClick={() => {
                      if (alertDisplayMode === CHOICE_DIALOG) {
                        openSelectorDialog({ isCopy: false });
                      } else if (alertDisplayMode === FULLSCREEN) {
                        openTearSheet({ isCopy: false, gotoPath: editSmartAlertPath });
                      } else {
                        openDialog({ isCopy: false });
                      }
                    }}
                  />
                </Tooltip>
              )}
              {displayDuplicateAction && (
                <Tooltip content={t('in-alerting:components.alertHeaderDuplicateTooltip')} delay={500}>
                  <IconButton
                    kind="primaryv2"
                    data-testid="duplicateConfigButton"
                    type="lib_actions_copy"
                    onClick={() => {
                      if (alertDisplayMode === CHOICE_DIALOG) {
                        openSelectorDialog({ isCopy: true });
                      } else if (alertDisplayMode === FULLSCREEN) {
                        openTearSheet({ isCopy: true, gotoPath: duplicateSmartAlertPath });
                      } else {
                        openDialog({ isCopy: true });
                      }
                    }}
                    alignment="right"
                  />
                </Tooltip>
              )}

              {/* TODO : Remove this once all the smart alerts are implemented with selector dialogs */}
              {!alertConfig?.builtIn && displayTearSheetActions && (
                <Tooltip content={getButtonName(t('in-alerting:components.alertHeaderEditTooltip'))} delay={500}>
                  <IconButton
                    kind="primaryv2"
                    data-testid="editConfigButtonTearsheet"
                    type="lib_actions_edit"
                    onClick={() => {
                      openTearSheet({ isCopy: false, gotoPath: editSmartAlertPath });
                    }}
                    alignment="right"
                  />
                </Tooltip>
              )}
              {!alertConfig?.builtIn && displayTearSheetActions && (
                <Tooltip content={getButtonName(t('in-alerting:components.alertHeaderDuplicateTooltip'))} delay={500}>
                  <IconButton
                    kind="primaryv2"
                    data-testid="duplicateConfigButtonTearsheet"
                    type="lib_actions_copy"
                    onClick={() => {
                      openTearSheet({ isCopy: true, gotoPath: duplicateSmartAlertPath });
                    }}
                    alignment="right"
                  />
                </Tooltip>
              )}

              {!alertConfig?.builtIn && (
                <Tooltip content={t('in-alerting:components.alertHeaderRestoreDeleteTooltip')} delay={500}>
                  <IconButton
                    kind="primaryv2"
                    data-testid="deleteConfigButton"
                    type={isDeleting ? 'lib_actions_loading' : 'lib_actions_delete'}
                    iconSpinning={isDeleting}
                    onClick={() => {
                      if (!isDeleting) {
                        onConfigDeleteTrigger?.(alertConfig.id);
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
            </div>
          )}
        </div>
      </div>
      {isLatestVersionDeleted && (
        <Message
          type="warning"
          withIcon
          className={locals.bottomSpace}
          title={t(
            'in-alerting:components.alertHeaderYouAreLookingAtADeletedAlertConfigurationModificationsAreNotPossible'
          )}
          fullInlineWidth
        />
      )}
      {!isLatestVersionDeleted && isNotLatestRevision && (
        <Message
          withIcon
          className={classNames({
            [locals.bottomSpace]: true
          })}
          fullInlineWidth
        >
          <span>
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
          </span>
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
  renderCustomTitle: PropTypes.func,
  showActionButton: PropTypes.bool,
  allowActionButtons: PropTypes.bool,
  onConfigDeleteTrigger: PropTypes.func,
  displayEditAction: PropTypes.bool,
  displayTearSheetActions: PropTypes.bool,
  getLinkToEditOrDuplicateSmartAlertTearSheet: PropTypes.func,
  displayDuplicateAction: PropTypes.bool,
  isGlobalSmartAlert: PropTypes.bool,
  hideAlertIcon: PropTypes.bool,
  openSelectorDialog: PropTypes.func,
  alertDisplayMode: PropTypes.string,
  openTearSheet: PropTypes.func
};

function openRestoreConfirmationDialog(alertRevision, doRestore) {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogHeader')}
      description={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogDescription')}
      confirmButtonLabel={t('in-alerting:components.alertHeaderRestoreRevisionConfirmationDialogConfirmButton')}
      confirmButtonKind="primary"
      onSubmit={() => {
        close();
        doRestore();
      }}
    />
  );
}

// export for test
export function getRevision(alertConfig, extendedAlertConfigVersions) {
  return extendedAlertConfigVersions.find(({ created }) => alertConfig.created === created) ?? alertConfig;
}
