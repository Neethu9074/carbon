/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SyntheticDatacenter } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { just } from '@instana/observables';

import {
  categorizeActivationRequestedDatacenters,
  formatRejectedDatacenters
} from 'in-synthetics/utils/datacenterHelperFunctions';
import { getColumnDefinitions } from 'in-synthetics/dashboards/global/tabs/locations/components/ActivateSelectedLocation';
import getSyntheticDatacenterDeployment from 'in-synthetics/subscriptions/getSyntheticDatacenterDeployment';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import SaveButton from 'in-components/form/SaveButton/SaveButton';
import { pendingResult } from 'in-services/fixedObjects';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/locations/components/DeactivateSelectedLocation.mless';

interface Props {
  singleDatacenter: SyntheticDatacenter[];
  onClose: () => void;
}
const ActivateConfirmationDialog = ({ singleDatacenter, onClose }: Props) => {
  const [rejectedDatacenters, setRejectedDatacenters] = useState<SyntheticDatacenter[]>([]);
  const [acceptedDatacenters, setAcceptedDatacenters] = useState<SyntheticDatacenter[]>([]);
  const result =
    useObservable(() => {
      return getSyntheticDatacenterDeployment({
        deploymentAction: 'activate',
        syntheticDatacenters: singleDatacenter
      }).filter((deployment: any) => {
        if (deployment && deployment.data) {
          const { rejectedArray, acceptedArray } = categorizeActivationRequestedDatacenters(deployment.data);
          setRejectedDatacenters(rejectedArray);
          setAcceptedDatacenters(acceptedArray);
          return deployment;
        }
      });
    }, []) ?? pendingResult;

  const button = (
    <SaveButton kind="primary" isLoading={result?.progress.loading} isSaving={false} onClick={onClose}>
      {t('in-synthetics:dialog.createLocation.managedLocation.okay')}
    </SaveButton>
  );

  const getTitle = () => {
    return rejectedDatacenters.length > 1
      ? t(
          'in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.activationRejectedMessageMultipleDatacenters',
          {
            rejectedDatacentersList: formatRejectedDatacenters(rejectedDatacenters)
          }
        )
      : t(
          'in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.activationRejectedMessageSingleDatacenter',
          {
            rejectedDatacentersList: formatRejectedDatacenters(rejectedDatacenters)
          }
        );
  };

  return (
    <BaseDialog
      title={t('in-synthetics:dialog.createLocation.managedLocation.activateLocation')}
      headerIcon={'lib_synthetic_location'}
      onClose={onClose}
      onSubmit={() => onClose}
      customButtons={button}
    >
      <div className={locals.descriptionWrapper}>
        <DangerousHtmlPresenter
          className={locals.htmlText}
          html={t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.message')}
        />
      </div>
      {result?.progress.loading ? (
        <LoadingIndicator
          text={t(
            'in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.activateLocationLoadingMessage'
          )}
          className={locals.messageWrapper}
        />
      ) : (
        <>
          {rejectedDatacenters.length > 0 && (
            <div className={locals.messageWrapper}>
              <Message type="warning" withIcon className={locals.bottomSpace} title={getTitle()} />
            </div>
          )}
          <List<SyntheticDatacenter>
            getHeader={() => null}
            columnDefinitions={getColumnDefinitions()}
            loadEntities={() => just(acceptedDatacenters)}
            renderNoDataAvailable={() => (
              <NoDataAvailable
                type="lib_synthetic"
                height={160}
                text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Datacenter' })}
              />
            )}
            isSearchable={false}
            pageSize={1}
            initialOrderBy="label"
          />
        </>
      )}
    </BaseDialog>
  );
};

export default ActivateConfirmationDialog;
