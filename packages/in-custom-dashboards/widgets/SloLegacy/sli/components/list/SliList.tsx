/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  PaginatedResult,
  Result,
  SliConfigurationWithLastUpdated,
  ApplicationSliEntity,
  SliConfiguration
} from '@instana/types';
import { IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  isApplicationSliConfig,
  isWebsiteTimeBasedSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliConfig,
  isApplicationSliEntity,
  isWebsiteEventBasedSliEntity,
  isWebsiteTimeBasedSliEntity,
  isAvailabilitySliEntity
} from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { ApplicationPerspectiveLabel } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/ApplicationPerspectiveLabel';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { WebsiteLabel } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/WebsiteLabel';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { FetchedState } from 'in-hooks/utils/types';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliManageList.mless';

type OverwrittenServerTableProps =
  | 'onRowClick'
  | 'numSkeletonRows'
  | 'isSearchable'
  | 'columnDefinitions'
  | 'result'
  | 'page'
  | 'pageSize';

interface SliListProps extends Omit<ServerTablePresenterProps<SliConfiguration>, OverwrittenServerTableProps> {
  selectSli: (item: SliConfiguration) => void;
  onDelete: (id: string) => void;
  fetchedConfigState: FetchedState<SliConfigurationWithLastUpdated[]>;
  onEdit: (item: SliConfiguration) => void;
}

type InternalSliListProps = SliListProps &
  Pick<ServerTablePresenterProps<SliConfiguration>, OverwrittenServerTableProps>;

export default function SliList(props: SliListProps) {
  const paginatedResult = fetchedStateToPaginatedResult(props.fetchedConfigState);
  const { page = 0, pageSize = 0 } = paginatedResult?.data ?? {};

  return (
    <ServerTablePresenter<SliConfiguration, InternalSliListProps>
      getRowProps={getRowProps}
      result={paginatedResult}
      page={page}
      pageSize={pageSize}
      cardTitle={t('in-custom-dashboards:widgets.slo.sliList.serviceLevelIndicators')}
      {...props}
      onRowClick={role?.canConfigureServiceLevelIndicators ? props.selectSli : undefined}
      numSkeletonRows={3}
      isSearchable
      columnDefinitions={columnDefinitions}
    />
  );
}

const getRowProps = () => {
  return {
    size: 'compact'
  } as const;
};

const columnDefinitions: ColumnDefinition<SliConfiguration, InternalSliListProps>[] = [
  {
    id: 'name',
    sortable: true,
    label: 'Name',
    getContent(sliConfig) {
      /** This is okay to disable since this function returns JSX and custom hooks work here */
      // eslint-disable-next-line

      return (
        <WithIcon
          iconColor={themes.default.ids.color.option.neutral['500']}
          icon={getIcon(sliConfig)}
          className={locals.withIcon}
        >
          <SliNameWithSubscript sliConfig={sliConfig} />
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
      if (isApplicationSliConfig(item) || isWebsiteTimeBasedSliConfig(item)) {
        let metricNameLabel = valueMissingPlaceholder;
        if (item.metricConfiguration) {
          const { metricName, metricAggregation } = item.metricConfiguration;
          metricNameLabel = metricName === 'latency' ? `${metricName} (${metricAggregation})` : metricName;
        }
        return t('in-custom-dashboards:widgets.slo.sliList.timeBasedSli', { metricNameLabel });
      } else if (isAvailabilitySliConfig(item) || isWebsiteEventBasedSliConfig(item)) {
        return t('in-custom-dashboards:widgets.slo.sliList.eventBasedSli');
      } else {
        return valueMissingPlaceholder;
      }
    }
  },
  {
    id: 'edit',
    label: '',
    sortable: false,
    width: '1',
    getContent(item, { onEdit }) {
      if (!role?.canConfigureServiceLevelIndicators) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-custom-dashboards:widgets.slo.sliList.viewCloneSliConfig')}>
            <IconButton
              kind="primary"
              type="lib_actions_edit"
              className={locals.iconButton}
              onClick={() => onEdit(item)}
            />
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
    getContent(item, { onDelete }) {
      if (!role?.canConfigureServiceLevelIndicators) {
        return null;
      }
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-custom-dashboards:widgets.slo.sliList.delSliConfig')}>
            <IconButton
              kind="primary"
              type="lib_actions_delete"
              className={locals.iconButton}
              onClick={() => {
                addActiveDialog(
                  <ConfirmationDialog
                    header={t('in-custom-dashboards:widgets.slo.sliList.confirmRemove')}
                    description={
                      <span>
                        <Trans
                          i18nKey="in-custom-dashboards:widgets.slo.sliList.confirmRemoveMsg"
                          values={{ sliName: item.sliName }}
                          components={{ italic: <i />, bold: <strong /> }}
                        />
                      </span>
                    }
                    confirmButtonLabel={t('in-custom-dashboards:widgets.slo.sliList.delete')}
                    onSubmit={() => {
                      close();
                      onDelete(item.id);
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
  if (isWebsiteEventBasedSliConfig(item) || isWebsiteTimeBasedSliConfig(item)) {
    return 'lib_website';
  }

  const sliEntity = item.sliEntity as Partial<ApplicationSliEntity> | undefined;
  if (sliEntity?.endpointId) {
    return 'lib_application_endpoint';
  } else if (sliEntity?.serviceId) {
    return 'lib_application_service';
  }
  return 'lib_application';
}
interface SliNameWithSubscriptProps {
  sliConfig: SliConfiguration;
}

function SliNameWithSubscript({ sliConfig }: SliNameWithSubscriptProps) {
  if (isApplicationSliEntity(sliConfig.sliEntity) || isAvailabilitySliEntity(sliConfig.sliEntity)) {
    return <ApplicationPerspectiveLabel sliName={sliConfig.sliName} sliEntity={sliConfig.sliEntity} />;
  }

  if (isWebsiteTimeBasedSliEntity(sliConfig.sliEntity) || isWebsiteEventBasedSliEntity(sliConfig.sliEntity)) {
    return <WebsiteLabel sliName={sliConfig.sliName} sliEntity={sliConfig.sliEntity} />;
  }
  return <></>;
}

function fetchedStateToPaginatedResult([sliConfigs, , errors, progress]: FetchedState<
  SliConfigurationWithLastUpdated[]
>): Result<PaginatedResult<SliConfigurationWithLastUpdated>> {
  if (!sliConfigs) return { errors, progress };

  const data = {
    items: sliConfigs,
    page: 1,
    pageSize: sliConfigs.length,
    totalHits: sliConfigs.length
  };

  return { errors, progress, data };
}
