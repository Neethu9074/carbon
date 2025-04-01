/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';

import {
  ALERTING_EDIT,
  ALERTING_DELETE_TRIGGER,
  ALERTING_DELETE_CONFIRM,
  ALERTING_PAUSED,
  ALERTING_RESUMED,
  ALERTING_CLONE_TRIGGER,
  ALERTING_REVISION_CHANGED
} from 'in-services/tracking/eventNames';
import { ShowSelectorDialog } from 'in-alerting/smart-alerts/components/tearSheet/ActionHandlers/TearSheetActionHandlers';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { alertCreated as alertCreatedMatrixParam } from 'in-applications/navigation/matrix';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { getTrackingAlertConfig } from 'in-alerting/smart-alerts/utils/segmentUtils';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { ADVANCED, FULLSCREEN } from 'in-alerting/smart-alerts/data/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import AlertHistoryList from 'in-alerting/components/AlertHistoryList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import AlertHeader from 'in-alerting/components/AlertHeader';
import { close } from 'in-components/DialogPresenter/store';
import { propTypeTimeConfig } from 'in-stores/time/config';
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
  showActionButton = true,
  getAllowedPlaceholders = () => [],
  displayEditAction = true,
  displayTearSheetActions = false,
  getLinkToEditOrDuplicateSmartAlertTearSheet,
  displayDuplicateAction = true,
  canConfigureGlobalAlertConfigs = false,
  canConfigureIndividualAlertConfigs = false,
  hideAlertIcon = false,
  alertDisplayMode
}) {
  const { goToPath, location, navigate } = useNavigation();
  const { trackCta } = useSegmentTracking();

  const [reload, triggerReload] = useState();

  const alertConfigId = getMatrixParameter(location, alertsTabSegment, alertIdParam);
  const alertConfigCreated = getMatrixParameter(location, alertsTabSegment, alertCreatedParam);

  const { alertConfig, alertConfigErrors } = useAlertConfig(getConfig, alertConfigId, alertConfigCreated, reload);
  const alertConfigForTracking = getTrackingAlertConfig(alertConfig, undefined);
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

  const openOldDialog = isCopy =>
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
            openOldDialog(isCopy);
            if (isCopy) {
              trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfigForTracking, dialogMode: ADVANCED });
            } else if (!isCopy) {
              trackCta(ALERTING_EDIT, { ...alertConfigForTracking, dialogMode: ADVANCED });
            }
          }}
          openSelectorDialog={({ isCopy }) => {
            addActiveDialog(
              <ShowSelectorDialog
                isCopy={isCopy}
                alertConfig={alertConfig}
                alertConfigId={alertConfigId}
                openDialog={() => openOldDialog(isCopy)}
                useSmartAlertCreateUrl={getLinkToEditOrDuplicateSmartAlertTearSheet}
              />
            );
          }}
          openTearSheet={({ isCopy, gotoPath }) => {
            if (isCopy) {
              trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfigForTracking, dialogMode: FULLSCREEN });
            } else if (!isCopy) {
              trackCta(ALERTING_EDIT, { ...alertConfigForTracking, dialogMode: FULLSCREEN });
            }
            goToPath(gotoPath.slice(2));
          }}
          fullyQualifiedAlertsList={listPath}
          doEnableConfig$={enableConfig}
          doDisableConfig$={disableConfig}
          doDeleteConfig$={deleteConfig}
          doRestoreConfig$={restoreConfig}
          onConfigStateChanged={(alertConfigId, enabled) => {
            if (enabled) {
              trackCta(ALERTING_PAUSED, { alertConfigId });
            } else {
              trackCta(ALERTING_RESUMED, { alertConfigId });
            }
          }}
          onConfigDeleted={() => {
            trackCta(ALERTING_DELETE_CONFIRM, alertConfigForTracking);
          }}
          onConfigRevisionChanged={() => trackCta(ALERTING_REVISION_CHANGED, alertConfigForTracking)}
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
            trackCta(ALERTING_DELETE_TRIGGER, alertConfigForTracking);
          }}
          displayEditAction={displayEditAction}
          displayTearSheetActions={displayTearSheetActions}
          getLinkToEditOrDuplicateSmartAlertTearSheet={getLinkToEditOrDuplicateSmartAlertTearSheet}
          displayDuplicateAction={displayDuplicateAction}
          hideAlertIcon={hideAlertIcon}
          alertDisplayMode={alertDisplayMode}
        />

        <Row>
          <Col xs={6}>{renderAlertConfiguration({ alertConfig, isGlobalSmartAlert })}</Col>
          <Col xs={6}>
            <AlertHistoryList alertConfigId={alertConfig.id} timeConfig={timeConfig} />
          </Col>
        </Row>
      </div>
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
  getLinkToEditOrDuplicateSmartAlertTearSheet: PropTypes.func,
  displayDuplicateAction: PropTypes.bool,
  canConfigureGlobalAlertConfigs: PropTypes.bool,
  canConfigureIndividualAlertConfigs: PropTypes.bool,
  hideAlertIcon: PropTypes.bool,
  alertDisplayMode: PropTypes.string
};
