/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactElement, useState } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { Message, ButtonKinds } from '@instana/components';
import { SyntheticDatacenter } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  categorizeActivationRequestedDatacenters,
  formatRejectedDatacenters
} from 'in-synthetics/utils/datacenterHelperFunctions';
import getSyntheticDatacenterDeployment from 'in-synthetics/subscriptions/getSyntheticDatacenterDeployment';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import BaseDialog from 'in-components/Dialog/BaseDialog';
import { pendingResult } from 'in-services/fixedObjects';
import SaveButton from 'in-components/form/SaveButton';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface Props {
  header: string | ReactElement;
  headerIcon?: string;
  buttonLabel?: string;
  buttonKind?: keyof typeof ButtonKinds;
  onSubmit: () => void;
  isSaving?: boolean;
  onClose?: () => void;
  form: MapForm<any>;
}

export const columnDefinitions = [
  {
    id: 'datacenter_code',
    label: t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.datacenterCode'),
    getContent(entity: SyntheticDatacenter) {
      return <span>{entity.code}</span>;
    }
  },
  {
    id: 'datacenter_name',
    label: t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.datacenterName'),
    getContent(entity: SyntheticDatacenter) {
      return <span>{entity.label}</span>;
    }
  },
  {
    id: 'location_name',
    label: t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.locationName'),
    getContent(entity: SyntheticDatacenter) {
      return <span>{entity.locationLabel}</span>;
    }
  },
  {
    id: 'datacenter_status',
    label: t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.table.heads.datacenterStatus'),
    getContent() {
      return (
        <span className={locals.entityWrapper}>
          <HealthDot className={classNames({ [locals.dot]: true })} severity={5} iconSize={8} />
          <span>{t('in-synthetics:dialog.createLocation.status.pending')}</span>
        </span>
      );
    }
  }
];

const ConfirmationDialog = ({
  header,
  headerIcon,
  buttonLabel = t('in-synthetics:dialog.createLocation.done'),
  buttonKind,
  onSubmit,
  isSaving,
  onClose,
  form
}: Props) => {
  const [rejectedDatacenters, setRejectedDatacenters] = useState<SyntheticDatacenter[]>([]);
  const [acceptedDatacenters, setAcceptedDatacenters] = useState<SyntheticDatacenter[]>([]);
  const result =
    useObservable(
      getSyntheticDatacenterDeployment({
        deploymentAction: 'activate',
        syntheticDatacenters: form.get('syntheticDatacenters').value
      }).filter((deployment: any) => {
        if (deployment && deployment.data) {
          const { rejectedArray, acceptedArray } = categorizeActivationRequestedDatacenters(deployment.data);
          setRejectedDatacenters(rejectedArray);
          setAcceptedDatacenters(acceptedArray);
          return deployment;
        }
      }),
      []
    ) ?? pendingResult;

  const button = (
    <SaveButton isSaving={isSaving} kind={buttonKind}>
      {buttonLabel}
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
    <BaseDialog title={header} headerIcon={headerIcon} onClose={onClose} onSubmit={onSubmit} customButtons={button}>
      <div className={locals.descriptionWrapper}>
        <div className={locals.descriptionHeadline}>
          {t('in-synthetics:dialog.createLocation.managedLocation.confirmationDialog.headline')}
        </div>
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
            columnDefinitions={columnDefinitions}
            loadEntities={() => just(acceptedDatacenters)}
            renderNoDataAvailable={() => (
              <NoDataAvailable
                type="lib_synthetic"
                height={160}
                text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Datacenters' })}
              />
            )}
            isSearchable={false}
            pageSize={20}
            initialOrderBy="datacenter_code"
          />
        </>
      )}
    </BaseDialog>
  );
};

export default ConfirmationDialog;
