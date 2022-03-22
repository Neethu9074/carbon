/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  isApplicationSliConfig,
  isWebsiteTimeBasedSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliConfig
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import ApplicationPerspectiveLabels from 'in-custom-dashboards/widgets/Slo/sli/components/list/ApplicationPerspectiveLabels';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { trackSliDeleted } from 'in-custom-dashboards/widgets/Slo/tracker';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { ApplicationSliEntity, SliConfiguration } from 'in-types';
import WithIcon from 'in-components/WithIcon';
import Tooltip from 'in-components/Tooltip';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';
import theme from 'in-themes';

import locals from 'in-custom-dashboards/widgets/Slo/sli/components/list/SliManageList.mless';

type OverwrittenServerTableProps = 'onRowClick' | 'numSkeletonRows' | 'isSearchable' | 'columnDefinitions';
type OptionalServerTableProps = 'orderDirection' | 'page' | 'pageSize' | 'orderBy';

interface SliListProps
  extends Omit<ServerTablePresenterProps<SliConfiguration>, OverwrittenServerTableProps | OptionalServerTableProps> {
  selectSli: (item: SliConfiguration) => void;
  onDelete: (id: string) => void;
}

type SliListPropsWithOptionals = SliListProps &
  Partial<Pick<ServerTablePresenterProps<SliConfiguration>, OptionalServerTableProps>>;
type InternalSliListProps = SliListProps &
  Pick<ServerTablePresenterProps<SliConfiguration>, OverwrittenServerTableProps | OptionalServerTableProps>;

export default function SliList(props: SliListPropsWithOptionals) {
  return (
    <ServerTablePresenter<SliConfiguration, InternalSliListProps>
      getRowProps={getRowProps}
      page={1}
      pageSize={100}
      orderBy="name"
      orderDirection="ASC"
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
    getContent(item, { onDelete }) {
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
                      onDelete(item.id);
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

function getSliNameWithSubscript(item: SliConfiguration) {
  const sliEntity = item.sliEntity as Partial<ApplicationSliEntity> | undefined;
  return (
    <ApplicationPerspectiveLabels
      sliName={item.sliName}
      applicationId={sliEntity?.applicationId}
      serviceId={sliEntity?.serviceId}
      endpointId={sliEntity?.endpointId}
    />
  );
}
