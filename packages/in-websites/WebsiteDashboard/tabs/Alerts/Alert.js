/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withState } from 'recompose';
import React from 'react';

import {
  websitesAlertingAlertRevisionChanged,
  websitesAlertingAlertDeleted,
  websitesAlertingAlertResumed,
  websitesAlertingAlertPaused,
  websitesAlertingAlertEdit
} from 'in-alerting/smart-alerts/websites/alerting/tracker';
import {
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig,
  updateAlertConfig
} from 'in-websites/api/websiteAlertConfig';
import { alertsTab, alertsTabListFullyQualified, alertsTabDetailsFullyQualified } from 'in-websites/navigation/paths';
import AlertConfiguration from 'in-websites/WebsiteDashboard/tabs/Alerts/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/alerting/AlertConfigDialog';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DefaultLoadingDashboard from 'in-new-components/Loading/DefaultLoadingDashboard';
import { alertCreated as alertCreatedMatrixParam } from 'in-websites/navigation/matrix';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { alertId as alertIdMatrixParam } from 'in-websites/navigation/matrix';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import AlertHistoryList from 'in-alerting/components/AlertHistoryList';
import AlertHeader from 'in-alerting/components/AlertHeader';
import getWebsite from 'in-subscription/website/getWebsite';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { Row, Col } from 'in-new-components/layout/Grid';
import SetBodyColor from 'in-components/SetBodyColor';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default compose(
  withState('reload', 'triggerReload', undefined),
  connectTo(({ location }) => {
    const alertConfigId = getMatrixParameter(location, alertsTab, alertIdMatrixParam);
    const alertConfigCreated = getMatrixParameter(location, alertsTab, alertCreatedMatrixParam);
    const alertConfig$ = getAlertConfig(alertConfigId, alertConfigCreated);
    const alertConfigVersions$ = getAllVersionsOfAlertConfig(alertConfigId).startWith(null);
    const websiteLabel$ = alertConfig$.flatMap(({ websiteId }) =>
      getWebsite({ id: websiteId }).map(({ data }) => data && data.label)
    );

    return {
      alertConfig: alertConfig$.startWith(null),
      alertConfigVersions: alertConfigVersions$,
      alertConfigError: alertConfig$.errors(),
      alertConfigVersionsError: alertConfigVersions$.errors(),
      websiteLabel: websiteLabel$
    };
  })
)(Alert);

function getAlertConfig(id, created) {
  return created ? getAlertConfigByIdAndTimestamp(id, created) : getLatestAlertConfig(id);
}

function Alert({
  alertConfig,
  alertConfigError,
  alertConfigVersions,
  alertConfigVersionsError,
  triggerReload,
  timeConfig,
  websiteLabel
}) {
  if (alertConfigError || alertConfigVersionsError) {
    return <ErroneousResultPresenter errors={[alertConfigError, alertConfigVersionsError].filter(Boolean)} />;
  } else if (!alertConfig || !alertConfigVersions) {
    return <DefaultLoadingDashboard />;
  }

  function setRevision(created) {
    mutateUrl(location => {
      location.pathname = alertsTabDetailsFullyQualified;
      setOrDeleteMatrixKey(location, alertsTab, alertCreatedMatrixParam, created);
    });
    if (!created) {
      triggerReload(Math.random());
    }
  }

  return (
    <>
      <Title title="Alert Details" dynamic={alertConfig.name} />
      <div>
        <AlertHeader
          alertConfig={alertConfig}
          alertConfigVersions={alertConfigVersions}
          setRevision={setRevision}
          openDialog={() => {
            addActiveDialog(
              <AlertConfigDialog
                onClose={() => {
                  close();
                  setRevision(null);
                }}
                formData={alertConfig}
                websiteLabel={websiteLabel}
                editMode
              />
            );
            websitesAlertingAlertEdit({ alertConfigId: alertConfig.id });
          }}
          fullyQualifiedAlertsList={alertsTabListFullyQualified}
          doEnableConfig$={enableAlertConfig}
          doDisableConfig$={disableAlertConfig}
          doDeleteConfig$={deleteAlertConfig}
          doRestoreConfig$={updateAlertConfig}
          onConfigStateChanged={(alertConfigId, enabled) => {
            if (enabled) {
              websitesAlertingAlertPaused({ alertConfigId });
            } else {
              websitesAlertingAlertResumed({ alertConfigId });
            }
          }}
          onConfigDeleted={websitesAlertingAlertDeleted}
          onConfigRevisionChanged={websitesAlertingAlertRevisionChanged}
        />

        <Row>
          <Col xs={6}>
            <AlertConfiguration alertConfig={alertConfig} websiteLabel={websiteLabel} />
          </Col>
          <Col xs={6}>
            <AlertHistoryList alertConfigId={alertConfig.id} timeConfig={timeConfig} />
          </Col>
        </Row>
      </div>
      <SetBodyColor color="#fff" />
      <Footer />
    </>
  );
}
