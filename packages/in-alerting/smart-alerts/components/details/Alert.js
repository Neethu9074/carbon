/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';

import AlertTitleWithPlaceholderHighlighting from 'in-alerting/smart-alerts/applications/inventory/AlertTitleWithPlacholderHighlighting';
import { alertCreated as alertCreatedMatrixParam } from 'in-applications/navigation/matrix';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-components/Loading/DefaultLoadingDashboard';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import AlertHistoryList from 'in-alerting/components/AlertHistoryList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import AlertHeader from 'in-alerting/components/AlertHeader';
import { alertsTab } from 'in-applications/navigation/paths';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { close } from 'in-components/DialogPresenter/store';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { propTypeLocation } from 'in-stores/navigation';
import SetBodyColor from 'in-components/SetBodyColor';
import { Col, Row } from 'in-components/layout/Grid';
import Footer from 'in-components/Footer/Footer';
import Title from 'in-components/Title';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Alert.mless';

export default function Alert({
  location,
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
  tracking = {}
}) {
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
    mutateUrl(location => {
      location.pathname = detailsPath;
      setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, created);
    });

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
            tracking.trackEdit?.({ alertConfigId: alertConfig.id });
          }}
          fullyQualifiedAlertsList={listPath}
          doEnableConfig$={enableConfig}
          doDisableConfig$={disableConfig}
          doDeleteConfig$={deleteConfig}
          doRestoreConfig$={restoreConfig}
          onConfigStateChanged={(alertConfigId, enabled) => {
            if (enabled) {
              tracking.trackPaused?.({ alertConfigId });
            } else {
              tracking.trackResumed?.({ alertConfigId });
            }
          }}
          onConfigDeleted={tracking.trackDeleted}
          onConfigRevisionChanged={tracking.trackRevisionChanged}
          renderCustomTitle={() => {
            return (
              <HorizontalFlexWrapper className={locals.titleWrapper}>
                <div>
                  <AlertTitleWithPlaceholderHighlighting configName={alertConfig.name} />
                </div>
                <BuiltInIndicator builtIn={alertConfig.builtIn} />
              </HorizontalFlexWrapper>
            );
          }}
        />

        <Row>
          <Col xs={6}>{renderAlertConfiguration({ alertConfig, isGlobalSmartAlert })}</Col>
          <Col xs={6}>
            <AlertHistoryList alertConfigId={alertConfig.id} timeConfig={timeConfig} />
          </Col>
        </Row>
      </div>
      <SetBodyColor color={theme.lib.colors.white} />
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
  location: propTypeLocation.isRequired,
  renderAlertConfiguration: PropTypes.func.isRequired,
  renderSmartAlertDialog: PropTypes.func.isRequired,
  restoreConfig: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  tracking: PropTypes.shape({
    trackEdit: PropTypes.func,
    trackDeleted: PropTypes.func,
    trackPaused: PropTypes.func,
    trackResumed: PropTypes.func,
    trackRevisionChanged: PropTypes.func
  }),
  paths: PropTypes.shape({
    detailsPath: PropTypes.string.isRequired,
    listPath: PropTypes.string.isRequired,
    alertsTabSegment: PropTypes.string.isRequired
  }).isRequired,
  matrix: PropTypes.shape({
    alertIdParam: PropTypes.string.isRequired,
    alertCreatedParam: PropTypes.string.isRequired
  }).isRequired
};
