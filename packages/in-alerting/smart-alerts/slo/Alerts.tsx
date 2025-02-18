/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Card, ColumnizedDefinition } from '@instana/components';

import {
  serviceLevelsAlertDetailsFullyQualified,
  serviceLevelsAlertsSegment,
  serviceLevelsObjectiveAlertDetailsFullyQualified
} from 'in-service-levels/navigation/path';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
import SmartAlertsListWithUrlState from 'in-alerting/smart-alerts/components/list/SmartAlertsListWithUrlState';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { sloSmartAlertDetailsUrlParameters } from 'in-service-levels/navigation/urlParameters';
import { getAllSloAlertConfigurations } from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
import { ActionHandlers } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import AlertConfigDialog from 'in-alerting/smart-alerts/slo/dialog/AlertConfigDialog';
import { trackAlertDeleteConfirm } from 'in-alerting/smart-alerts/components/tracker';
import SloAppliedColumn from 'in-alerting/smart-alerts/slo/list/SloAppliedColumn';
import AlertTypeColumn from 'in-alerting/smart-alerts/slo/list/AlertTypeColumn';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Location } from 'in-stores/navigation/types';
import { deepFreeze } from 'in-services/util/object';
import Footer from 'in-components/Footer/Footer';
import { Trans, t } from 'in-i18n';

const sortOptions = deepFreeze([{ label: t('in-alerting:smartAlerts.sortOptions.name'), value: 'name' }]);

export interface AlertsProps {
  sloId?: string;
}

export default function Alerts({ sloId }: AlertsProps) {
  const location = useLocation();
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.slo,
          pageRootName: pageNames.smart_alerts,
          pagePath: location?.pathname
        }}
      />
      <Card>
        <SmartAlertsListWithUrlState
          getLocalAlertConfigsFetchFunction={() => getAllSloAlertConfigurations(sloId)}
          getLocalAlertConfigTitle={numberOfAlerts =>
            t('in-alerting:smartAlerts.list.header.configuredAlerts', {
              numberOfAlerts
            })
          }
          columnDefinitions={columnDefinitions}
          sortOptions={sortOptions}
          createRowLinkLocation={(config, location) => createRowLinkLocation(config, location, sloId)}
          alertsTab={serviceLevelsAlertsSegment}
        />
      </Card>
      <Footer />
    </>
  );
}

const columnDefinitions: ColumnizedDefinition[] = [
  {
    width: '30%',
    getContent: ({ config }) => <NameColumnCell config={config} />
  },
  {
    getContent: ({ config }) => <AlertTypeColumn config={config} />,
    width: '20%'
  },
  {
    getContent: ({ config }) => <SloAppliedColumn config={config} />,
    width: '20%'
  },
  {
    getContent: ({ config }) => <ListActionsColumn config={config} actionHandlers={actionHandlers} isLoading={false} />
  }
];

function createRowLinkLocation(
  config: ServiceLevelsAlertConfigWithMetadata,
  location: Location,
  id?: string
): Location {
  if (id) {
    location.pathname = serviceLevelsObjectiveAlertDetailsFullyQualified;
  } else {
    location.pathname = serviceLevelsAlertDetailsFullyQualified;
  }
  const alertIdParameter = sloSmartAlertDetailsUrlParameters.alertId;
  const alertCreatedParameter = sloSmartAlertDetailsUrlParameters.alertCreated;
  setOrDeleteMatrixKey(location, alertIdParameter.path ?? '', alertIdParameter.name, config.id);
  setOrDeleteMatrixKey(location, alertCreatedParameter.path ?? '', alertCreatedParameter.name, config.created);

  return location;
}

const handleToggleEnabled: ActionHandlers<ServiceLevelsAlertConfigWithMetadata>['handleToggleEnabled'] = (
  enabled,
  id,
  setIsSaving
) => {
  setIsSaving(true);

  (enabled ? disableAlertConfig(id, baseUrl.SLO) : enableAlertConfig(id, baseUrl.SLO)).once(
    () => {
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
};

const handleDelete: ActionHandlers<ServiceLevelsAlertConfigWithMetadata>['handleDelete'] = (
  id,
  setIsSaving,
  configName
) => {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:smartAlerts.components.list.labelConfirm')}
      description={
        <span>
          <Trans i18nKey="in-alerting:smartAlerts.components.list.labelConfirmRemoveConfig" values={{ configName }} />
        </span>
      }
      confirmButtonLabel={t('in-alerting:smartAlerts.components.list.labelRemove')}
      onSubmit={() => {
        setIsSaving(true);
        close();
        deleteAlertConfig(id, baseUrl.SLO).once(
          () => {
            trackAlertDeleteConfirm(id);
            refreshSmartAlertConfigsList();
          },
          () => {
            setIsSaving(false);
          }
        );
      }}
    />
  );
};

function handleClone(config: ServiceLevelsAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config: ServiceLevelsAlertConfigWithMetadata) {
  openSmartAlertDialog(config, false);
}

function openSmartAlertDialog(config: ServiceLevelsAlertConfigWithMetadata, isCopy: boolean) {
  addActiveDialog(
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      editMode={!isCopy}
    />
  );
}

const actionHandlers: ActionHandlers<ServiceLevelsAlertConfigWithMetadata> = {
  handleClone,
  handleEdit,
  handleToggleEnabled,
  handleDelete
};
