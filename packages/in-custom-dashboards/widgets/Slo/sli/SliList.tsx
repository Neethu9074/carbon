/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { KeyValue } from '@instana/components';
import { SvgIcon } from '@instana/components';

import {
  ApplicationSliEntity,
  PaginatedResult,
  Result,
  SliConfigMetricConfiguration,
  SliConfiguration
} from 'in-types';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { availabilityType, applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import { trackSliDeleted } from 'in-custom-dashboards/widgets/Slo/tracker';
import getApplication from 'in-applications/subscriptions/getApplication';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { deleteSliConfiguration } from 'in-custom-dashboards/api';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import locals from 'in-custom-dashboards/widgets/Slo/sli/SliManageList.mless';

type OverwrittenServerTableProps = 'onRowClick' | 'numSkeletonRows' | 'isSearchable' | 'columnDefinitions';
type OptionalServerTableProps = 'orderDirection' | 'page' | 'pageSize' | 'orderBy';

interface SliListProps
  extends Omit<ServerTablePresenterProps<SliConfiguration>, OverwrittenServerTableProps | OptionalServerTableProps> {
  getItems: () => Observable<Result<PaginatedResult<SliConfiguration>>>;
  selectSli: (item: SliConfiguration) => void;
}

interface SliTableProps extends SliListProps {
  deleteSli: (id: string) => void;
}

type SliListPropsWithOptionals = SliListProps &
  Partial<Pick<ServerTablePresenterProps<SliConfiguration>, OptionalServerTableProps>>;
type InternalSliListProps = SliTableProps &
  Pick<ServerTablePresenterProps<SliConfiguration>, OverwrittenServerTableProps | OptionalServerTableProps>;

export default function SliList(props: SliListPropsWithOptionals) {
  const result = useObservable(props.getItems, [props.getItems]);
  return (
    <ServerTablePresenter<SliConfiguration, InternalSliListProps>
      getRowProps={getRowProps}
      page={1}
      pageSize={100}
      orderBy="name"
      orderDirection="ASC"
      cardTitle={t('in-custom-dashboards:widgets.slo.sliList.serviceLevelIndicators')}
      {...props}
      result={result}
      onRowClick={role?.canConfigureServiceLevelIndicators ? props.selectSli : undefined}
      numSkeletonRows={3}
      isSearchable
      columnDefinitions={columnDefinitions}
      deleteSli={deleteSliConfig}
    />
  );
}

const deleteSliConfig = (id: string): void => {
  deleteSliConfiguration(id).once(
    () => {
      addMessage(
        {
          type: 'info',
          timeout: 2000,
          content: t('in-custom-dashboards:widgets.slo.sliList.sliConfigDeleted')
        },
        'custom-dashboard-info'
      );
    },
    () => {
      addMessage(
        {
          type: 'danger',
          timeout: 3000,
          content: t('in-custom-dashboards:widgets.slo.sliList.failedDelSli')
        },
        'custom-dashboard-error'
      );
    }
  );
};
const getRowProps = () => {
  return {
    size: 'compact'
  } as const;
};

const columnDefinitions: ColumnDefinition<SliConfiguration, InternalSliListProps>[] = [
  {
    id: 'name',
    sortable: false,
    label: 'Name',
    getContent(item) {
      return (
        <WithIcon iconColor={theme.lib.colors.N500} icon={getIcon(item)} className={locals.withIcon}>
          {getSliNameWithSubscript(item)}
        </WithIcon>
      );
    }
  },
  {
    id: 'metric',
    sortable: false,
    label: t('in-custom-dashboards:widgets.slo.sliList.sliType'),
    width: 20,
    getContent(item) {
      const metric = (metricConfiguration: SliConfigMetricConfiguration) => {
        if (metricConfiguration) {
          const { metricName, metricAggregation } = metricConfiguration;
          return metricName === 'latency' ? `${metricName} (${metricAggregation})` : metricName;
        }
        return valueMissingPlaceholder;
      };
      const value = (item: SliConfiguration) => {
        if (item.sliEntity?.sliType === applicationType) {
          return 'Time-based, ' + (item?.metricConfiguration && metric(item.metricConfiguration));
        } else if (item.sliEntity?.sliType === availabilityType) {
          return 'Event-based';
        } else {
          return '';
        }
      };
      return (item && value(item)) ?? valueMissingPlaceholder;
    }
  },
  {
    id: 'view',
    label: '',
    sortable: false,
    width: '1',
    getContent(item, { selectSli }) {
      if (!role?.canConfigureServiceLevelIndicators) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-custom-dashboards:widgets.slo.sliList.viewCloneSliConfig')}>
            <SvgIcon type="lib_actions_edit" className={locals.iconButton} onClick={() => selectSli(item)} />
          </Tooltip>
        </div>
      );
    }
  },
  {
    id: 'delete',
    label: '',
    sortable: false,
    width: '1',
    getContent(item) {
      if (!role?.canConfigureServiceLevelIndicators) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-custom-dashboards:widgets.slo.sliList.delSliConfig')}>
            <SvgIcon
              type="lib_actions_delete"
              className={locals.iconButton}
              onClick={() => {
                addActiveDialog(
                  <ConfirmationDialog
                    header={t('in-custom-dashboards:widgets.slo.sliList.pleaseConfirm')}
                    description={
                      <span>
                        <Trans
                          i18nKey="in-custom-dashboards:widgets.slo.sliList.pleaseConfirmMsg"
                          values={{ sliName: item.sliName }}
                          components={{ italic: <i />, bold: <strong /> }}
                        />
                      </span>
                    }
                    confirmButtonLabel={t('in-custom-dashboards:widgets.slo.sliList.delete')}
                    onSubmit={() => {
                      close();
                      deleteSliConfig(item.id);
                      trackSliDeleted({ sliType: item.sliEntity?.sliType });
                    }}
                  />
                );
              }}
            />
          </Tooltip>
        </div>
      );
    }
  }
];

function getIcon(item: SliConfiguration): string {
  const sliEntity = item.sliEntity as Partial<ApplicationSliEntity> | undefined;
  if (sliEntity?.endpointId) {
    return 'lib_application_endpoint';
  } else if (sliEntity?.serviceId) {
    return 'lib_application_service';
  }
  return 'lib_application';
}

function getLabel(result: Result<{ label?: string }>): string | null {
  return get(result, ['data', 'label'], null);
}

function getSliNameWithSubscript(item: SliConfiguration) {
  const sliEntity = item.sliEntity as Partial<ApplicationSliEntity> | undefined;
  return (
    <Labels
      sliName={item.sliName}
      applicationId={sliEntity?.applicationId}
      serviceId={sliEntity?.serviceId}
      endpointId={sliEntity?.endpointId}
    />
  );
}

interface LabelsProps {
  sliName: string;
  applicationId?: string;
  serviceId?: string;
  endpointId?: string;
}

function Labels({ serviceId, endpointId, applicationId, sliName }: LabelsProps) {
  const applicationLabel = useObservable(() => {
    if (!applicationId) return undefined;
    return getApplication({ id: applicationId }).map(getLabel);
  }, [applicationId]);
  const serviceLabel = useObservable(() => {
    if (!serviceId) return undefined;
    return getServiceLabel({ id: serviceId }).map(getLabel);
  }, [serviceId]);
  const endpointLabel = useObservable(() => {
    if (!endpointId) return undefined;
    return getEndpointInfo({ id: endpointId }).map(getLabel);
  }, [endpointId]);

  let subscript = '';
  if (applicationLabel) {
    subscript = subscript + applicationLabel;
  }
  if (serviceLabel) {
    subscript = `${subscript} > ${serviceLabel}`;
  }
  if (endpointLabel) {
    subscript = `${subscript} > ${endpointLabel}`;
  }
  return <KeyValue label={subscript} value={sliName} className={locals.nameColumn} />;
}
