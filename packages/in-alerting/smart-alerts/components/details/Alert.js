/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  trackAlertDeleteTrigger,
  trackAlertDeleteConfirm,
  trackAlertEdit,
  trackAlertCloneTrigger,
  trackAlertPaused,
  trackAlertResumed
} from 'in-alerting/smart-alerts/components/tracker';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { alertCreated as alertCreatedMatrixParam } from 'in-applications/navigation/matrix';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import AlertHistoryList from 'in-alerting/components/AlertHistoryList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import AlertHeader from 'in-alerting/components/AlertHeader';
import { close } from 'in-components/DialogPresenter/store';
import { propTypeTimeConfig } from 'in-stores/time/config';
import SetBodyColor from 'in-components/SetBodyColor';
import { Col, Row } from 'in-components/layout/Grid';
import Footer from 'in-components/Footer/Footer';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './Alert.mless';

export default function Alert({
  timeConfig,
  paths: { detailsPath, listPath, alertsTabSegment },
  matrix: { alertIdParam, alertCreatedParam },
  getConfig,
  getConfigVersions,
  enableConfig,
  disableConfig,
  deleteConfig,
  restoreConfig,
  isGlobalSmartAlert,
  renderSmartAlertDialog,
  renderAlertConfiguration,
  tracking = {},
  showActionButton = true,
  getAllowedPlaceholders = () => [],
  displayEditAction = true,
  displayTearSheetActions = false,
  displayDuplicateAction = true,
  canConfigureGlobalAlertConfigs = false,
  canConfigureIndividualAlertConfigs = false
}) {
  const { location, navigate } = useNavigation();

  const [reload, triggerReload] = useState();

  const alertConfigId = getMatrixParameter(location, alertsTabSegment, alertIdParam);
  const alertConfigCreated = getMatrixParameter(location, alertsTabSegment, alertCreatedParam);

  const { alertConfig, alertConfigErrors } = useAlertConfig(getConfig, alertConfigId, alertConfigCreated, reload);
  const { alertConfigVersions, alertConfigVersionsErrors } = useAlertConfigVersions(
    getConfigVersions,
    alertConfigId,
    reload
  );
  if (alertConfigErrors?.length || alertConfigVersionsErrors?.length) {
    return <ErroneousResultPresenter errors={[...alertConfigErrors, ...alertConfigVersionsErrors]} />;
  } else if (!alertConfig || !alertConfigVersions) {
    return <DefaultLoadingDashboard />;
  }

  function setRevision(created) {
    const targetLocation = { ...location, pathname: detailsPath };
    setOrDeleteMatrixKey(targetLocation, alertsTabSegment, alertCreatedMatrixParam, created);
    navigate(targetLocation);

    /**
     * We need to manually trigger a reload because the latest revisions is identified by the
     * absence of the created parameter.This means creating a new revision (by saving a changed config)
     * changes no value which could trigger a reload.
     */
    if (!created) {
      triggerReload(Math.random());
    }
  }

  return (
    <>
      <Title title={t('in-alerting:smartAlerts.applications.details.title')} dynamic={alertConfig.name} />
      <div>
        <AlertHeader
          alertConfig={alertConfig}
          alertConfigVersions={alertConfigVersions}
          setRevision={setRevision}
          isGlobalSmartAlert={isGlobalSmartAlert}
          openDialog={({ isCopy }) => {
            addActiveDialog(
              renderSmartAlertDialog({
                close,
                alertConfig,
                setRevision,
                isCopy,
                detailsPath,
                alertConfigId,
                isGlobalSmartAlert
              })
            );
            if (isCopy) {
              trackAlertCloneTrigger(alertConfig);
            } else if (!isCopy) {
              trackAlertEdit(alertConfig);
            }
          }}
          fullyQualifiedAlertsList={listPath}
          doEnableConfig$={enableConfig}
          doDisableConfig$={disableConfig}
          doDeleteConfig$={deleteConfig}
          doRestoreConfig$={restoreConfig}
          onConfigStateChanged={(alertConfigId, enabled) => {
            if (enabled) {
              if (tracking.trackPaused) {
                tracking.trackPaused?.({ alertConfigId });
              } else {
                trackAlertPaused(alertConfig);
              }
            } else {
              if (tracking.trackResumed) {
                tracking.trackResumed?.({ alertConfigId });
              } else {
                trackAlertResumed(alertConfig);
              }
            }
          }}
          onConfigDeleted={() => {
            if (tracking.trackDeleted) {
              tracking.trackDeleted({ alertConfig });
            } else {
              trackAlertDeleteConfirm(alertConfig);
            }
          }}
          onConfigRevisionChanged={tracking.trackRevisionChanged}
          renderCustomTitle={() => {
            return (
              <HorizontalFlexWrapper className={locals.titleWrapper}>
                <div>{replacePlaceholdersWithMarkup(getAllowedPlaceholders(alertConfig), alertConfig.name)}</div>
                <BuiltInIndicator builtIn={alertConfig.builtIn} />
              </HorizontalFlexWrapper>
            );
          }}
          showActionButton={showActionButton}
          allowActionButtons={isGlobalSmartAlert ? canConfigureGlobalAlertConfigs : canConfigureIndividualAlertConfigs}
          onConfigDeleteTrigger={() => {
            trackAlertDeleteTrigger(alertConfig);
          }}
          displayEditAction={displayEditAction}
          displayTearSheetActions={displayTearSheetActions}
          displayDuplicateAction={displayDuplicateAction}
        />

        <Row>
          <Col xs={6}>{renderAlertConfiguration({ alertConfig, isGlobalSmartAlert })}</Col>
          <Col xs={6}>
            <AlertHistoryList alertConfigId={alertConfig.id} timeConfig={timeConfig} />
          </Col>
        </Row>
      </div>
      <SetBodyColor color={themes.default.ids.color.option.white} />
      <Footer />
    </>
  );
}

function useAlertConfigVersions(getConfigVersions, alertConfigId, reload) {
  const result = useObservable(() => getConfigVersions(alertConfigId), [alertConfigId, reload]) ?? {};
  return { alertConfigVersions: result.data, alertConfigVersionsErrors: result.errors };
}

function useAlertConfig(getConfig, alertConfigId, alertConfigCreated, reload) {
  const result =
    useObservable(() => getConfig(alertConfigId, alertConfigCreated), [alertConfigId, alertConfigCreated, reload]) ??
    {};
  return { alertConfig: result.data, alertConfigErrors: result.errors };
}

Alert.propTypes = {
  deleteConfig: PropTypes.func.isRequired,
  disableConfig: PropTypes.func.isRequired,
  enableConfig: PropTypes.func.isRequired,
  getConfig: PropTypes.func.isRequired,
  getConfigVersions: PropTypes.func.isRequired,
  isGlobalSmartAlert: PropTypes.bool,
  renderAlertConfiguration: PropTypes.func.isRequired,
  renderSmartAlertDialog: PropTypes.func.isRequired,
  restoreConfig: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  tracking: PropTypes.shape({
    trackEdit: PropTypes.func,
    trackDeleted: PropTypes.func,
    trackPaused: PropTypes.func,
    trackResumed: PropTypes.func,
    trackRevisionChanged: PropTypes.func,
    trackDeleteTrigger: PropTypes.func
  }),
  paths: PropTypes.shape({
    detailsPath: PropTypes.string.isRequired,
    listPath: PropTypes.string.isRequired,
    alertsTabSegment: PropTypes.string.isRequired
  }).isRequired,
  matrix: PropTypes.shape({
    alertIdParam: PropTypes.string.isRequired,
    alertCreatedParam: PropTypes.string.isRequired
  }).isRequired,
  showActionButton: PropTypes.bool,
  getAllowedPlaceholders: PropTypes.func,
  displayEditAction: PropTypes.bool,
  displayTearSheetActions: PropTypes.bool,
  displayDuplicateAction: PropTypes.bool,
  canConfigureGlobalAlertConfigs: PropTypes.bool,
  canConfigureIndividualAlertConfigs: PropTypes.bool
};
