/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { IconButton } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  GetAllSloConfigurationsArguments,
  getAllSloConfigurations,
  getSloConfiguration
} from 'in-service-levels/api/sloConfiguration';
//@ts-expect-error doesn't contain type file
import { add, remove } from 'in-plg/pages/WelcomePage/widgets/starredItems';
import SloErrorBudgetColumnContent from 'in-service-levels/components/SloList/components/SloErrorBudgetColumnContent';
import { ColumnDefinitionItem, WidgetProps } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import SloBlueprintColumnContent from 'in-service-levels/components/SloList/components/SloBlueprintColumnContent';
import SloStatusColumnContent from 'in-service-levels/components/SloList/components/SloStatusColumnContent';
import SloNameColumnContent from 'in-service-levels/components/SloList/components/SloNameColumnContent';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import { serviceLevelObjective } from 'in-plg/pages/WelcomePage/widgets/starredItems/types';
import SloEntityInfo from 'in-service-levels/components/SloList/components/SloEntityInfo';
import DatatableWrapper from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper';
import useSloEntitiesLabels from 'in-service-levels/hooks/useSloEntitiesLabels';
import { buildSloListItem } from 'in-service-levels/hooks/useSloListItems';
import useSloListMetrics from 'in-service-levels/hooks/useSloListMetrics';
import { serviceLevelsOverview } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { SloListItem } from 'in-service-levels/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useMediaQuery from 'in-hooks/useMediaQuery';
import { role } from 'in-stores/user';

type CellRendererProps = {
  item: ServiceLevelObjectiveConfiguration;
  render: (sloListItem: SloListItem) => JSX.Element;
};

const SloCellRenderer = ({ item, render }: CellRendererProps) => {
  const sloListItem = getSloListItem(item);
  return render(sloListItem);
};

function getSloListItem(item: ServiceLevelObjectiveConfiguration) {
  const timeConfig = useTimeConfig();
  const [labels] = useSloEntitiesLabels([item]);
  const [metrics] = useSloListMetrics([item]);
  const configuration = item;
  return buildSloListItem({ configuration, labels, metrics, timeConfig });
}

function handleFavoriteClick(item: any, isFavourite: boolean, type: string) {
  const id = item?.configuration?.id;
  if (!id && !item) return;
  if (isFavourite) {
    remove({ id, type });
  } else {
    add({
      id,
      label: item.configuration.name,
      type
    });
  }
}

export default function ServiceLevelsWidget({ config, timeConfig, widgetLabel, dashboardTileProps }: WidgetProps) {
  const { createHrefToPath } = useNavigation();

  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };
  const openCreateSloDialog = () => addActiveDialog(<ConfigureSloDialog mode="NEW" trackingMeta={meta} />);

  const isMediumWidth = useMediaQuery('(min-width: 1560px)');

  const getHeaders = () => {
    return [
      {
        header: t('in-service-levels:sloList.columnLabels.name'),
        key: 'name'
      },
      {
        header: t('in-service-levels:sloList.columnLabels.entity'),
        key: 'entity'
      },
      {
        header: t('in-service-levels:sloList.columnLabels.blueprint'),
        key: 'blueprint'
      },
      {
        header: t('in-service-levels:sloList.columnLabels.errorBudget'),
        key: 'errorBudgetRemaining'
      },
      {
        header: t('in-service-levels:sloList.columnLabels.status'),
        key: 'status'
      },
      {
        key: 'favourite',
        header: ''
      }
    ];
  };

  const columnDefinitions: ColumnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        return <SloCellRenderer item={item} render={sloListItem => <SloNameColumnContent item={sloListItem} />} />;
      }
    },
    {
      key: 'entity',
      getContent({ item }) {
        return (
          <SloCellRenderer
            item={item}
            render={sloListItem => <SloEntityInfo entities={sloListItem.entities} entityType={item.entity.type} />}
          />
        );
      }
    },
    {
      key: 'blueprint',
      getContent({ item }) {
        return <SloCellRenderer item={item} render={sloListItem => <SloBlueprintColumnContent item={sloListItem} />} />;
      }
    },
    {
      key: 'errorBudgetRemaining',
      getContent({ item }) {
        return (
          <SloCellRenderer
            item={item}
            render={sloListItem => <SloErrorBudgetColumnContent item={sloListItem} showSparkChart={isMediumWidth} />}
          />
        );
      }
    },
    {
      key: 'status',
      getContent({ item }) {
        return <SloCellRenderer item={item} render={sloListItem => <SloStatusColumnContent item={sloListItem} />} />;
      }
    },
    {
      key: 'favourite',
      getContent({ item, isDisabled = false, isFavourite = false }) {
        return (
          <SloCellRenderer
            item={item}
            render={sloListItem => (
              <IconButton
                aria-label={
                  isFavourite
                    ? t('in-plg:welcomepage.favouriteButton.ariaFilled')
                    : t('in-plg:welcomepage.favouriteButton.aria')
                }
                type={isFavourite ? 'lib_actions_favorite_filled' : 'lib_actions_favorite'}
                onClick={() => handleFavoriteClick(sloListItem, isFavourite, serviceLevelObjective)}
                iconSize="xs"
                disabled={isDisabled}
              />
            )}
          />
        );
      }
    }
  ];

  const generalProps = {
    ...config,
    timeConfig,
    headers: getHeaders(),
    columnDefinitions
  };

  const sloConfigurationsArguments: GetAllSloConfigurationsArguments = {
    page: 1,
    pageSize: 5,
    orderDirection: 'ASC',
    orderBy: 'sloStatus'
  };

  return (
    <DatatableWrapper
      {...generalProps}
      tableType="serviceLevelWidget"
      getItems={(params: any) => {
        return getAllSloConfigurations({ ...params, ...sloConfigurationsArguments });
      }}
      getItem={(id: any) => {
        return getSloConfiguration(id);
      }}
      hasAddPermission={role?.canConfigureServiceLevelIndicators}
      hasAddMore={role?.canConfigureServiceLevelIndicators}
      viewAll
      addMore={openCreateSloDialog}
      addData={openCreateSloDialog}
      href={createHrefToPath(serviceLevelsOverview)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
      pinnedItemTypes={[serviceLevelObjective]}
      searchPlaceholderLabel={t('in-plg:welcomepage.component.serviceLevelsWidget.searchPlaceholderLabel')}
      addButtonLabel={t('in-plg:welcomepage.component.serviceLevelsWidget.addButtonLabel')}
      viewAllLabel={t('in-plg:welcomepage.component.serviceLevelsWidget.viewAllLabel')}
    />
  );
}
