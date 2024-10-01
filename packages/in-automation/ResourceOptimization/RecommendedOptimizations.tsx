/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Spacer, Stack, Typography } from '@instana/components';

import {
  actionCategoryColumn,
  nameColumn,
  typesColumn,
  impactedServicesColumn
} from 'in-automation/ResourceOptimization/columnDefinitions';
import useServerTableUrlState, {
  ServerTableUrlState
} from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import useNavigateToActionDetails from 'in-automation/navigation/hooks/useNavigateToActionDetails';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import { generateMetrics, fixedTimestamp } from 'in-test/util/generateMetrics';
import { FormatterObject, MetricDataSeries } from 'in-components/Chart/types';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { TriggerSpecification } from 'in-automation/Policies/types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { isExternal } from 'in-automation/ActionCatalog/shared';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { Event, Result, VolatileId } from 'in-types';
import { chartColors } from 'in-themes/chartColors';
import { mapData } from 'in-services/util/result';
import { success } from 'in-services/util/result';
import { ScoredAction } from 'in-automation/api';
import { recommendedList } from './testData';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './RecommendedOptimizations.mless';

const pathSegment = '/RecommendedOptimizations';
const matrixPrefix = '';

interface RecommendedOptimizationsTableProps extends ServerTablePresenterProps<ScoredAction> {
  volatileId: VolatileId;
  event: Event;
  trigger: Result<TriggerSpecification>;
}

const columnDefinitions: ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>[] = [
  nameColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>,
  typesColumn,
  impactedServicesColumn,
  actionCategoryColumn as ColumnDefinition<ScoredAction, RecommendedOptimizationsTableProps>
];

function useFilters({
  setServerTableUrlState,
  recommendedOptimizations
}: {
  recommendedOptimizations: Result<ScoredAction[]>;
  setServerTableUrlState: (newState: Partial<Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns'>>) => void;
}) {
  const [types, setTypesState] = useState<string[] | undefined>(undefined);
  const [aiEngine, setAiEngine] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const filters = [
    {
      key: 'types' as const,
      value: types
    },
    {
      key: 'aiEngine' as const,
      value: aiEngine
    },
    {
      key: 'tags' as const,
      value: tags
    }
  ];

  return {
    filteredActions: mapData(recommendedOptimizations, data =>
      data?.filter(action =>
        filters.reduce((shouldInclude, filter) => {
          const emptyFilter = !filter.value?.length;
          if (emptyFilter) return shouldInclude;
          switch (filter.key) {
            case 'types':
              return shouldInclude && (filter.value?.some(type => action.type === type) ?? false);
            case 'aiEngine':
              return (shouldInclude = shouldInclude && filter.value === action.aiEngine);
            case 'tags':
              return shouldInclude && (action.tags?.some(tag => filter.value?.includes(tag)) ?? false);
          }
        }, true)
      )
    ),
    types,
    setTypes: ({ types }: { types: string[] | undefined }) => {
      setTypesState(types);
      setServerTableUrlState({ page: 1, query: '' });
    },
    aiEngine,
    setAiEngine: (aiEngine: string | null) => {
      setAiEngine(aiEngine);
      setServerTableUrlState({ page: 1, query: '' });
    },
    tags,
    setTags: (tags: string[]) => {
      setTags(tags);
      setServerTableUrlState({ page: 1, query: '' });
    }
  };
}

interface RecommendedOptimizationsProps {
  volatileId: VolatileId;
  event: Event;
  recommendedOptimizations: Result<ScoredAction[]>;
  trigger: Result<TriggerSpecification>;
}

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const timeConfig = generateTimeframe(oneMinute);
const granularity = getChartGranularity(timeConfig);

function generateTimeframe(windowSize: number) {
  return {
    windowSize,
    to: fixedTimestamp,
    autoRefresh: false
  };
}

function generateMultipleMetrics(numSeries: number, numMetrics: number, maxValue: number, windowSize: number) {
  const series = [];
  for (let i = 0; i < numSeries; i++) {
    series[i] = generateMetrics(numMetrics, maxValue, windowSize) as MetricDataSeries;
  }
  return series;
}

export default function RecommendedOptimizations({
  volatileId,
  event,
  recommendedOptimizations,
  trigger
}: RecommendedOptimizationsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;
  const navigateToActionDetails = useNavigateToActionDetails();
  recommendedOptimizations = recommendedOptimizations || recommendedList;

  const colorPalette = [
    chartColors.fiveColorPalette[1],
    chartColors.fiveColorPalette[2],
    chartColors.fiveColorPalette[0],
    chartColors.fiveColorPalette[3],
    chartColors.fiveColorPalette[4]
  ];

  const { filteredActions, types, setTypes } = useFilters({
    recommendedOptimizations,
    setServerTableUrlState
  });

  const result = usePaginatedScoredActions({
    actions: filteredActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  const totalHits = result?.data?.totalHits;

  const handleRowClick = (action: ScoredAction) => {
    if (!isExternal(action.type)) {
      navigateToActionDetails(action.id, false);
    }
  };

  return (
    <div className={locals.contentContainer}>
      <InfoPanel
        content={{
          //text not finalized, no i18n yet
          title: 'Resource optimizations, powered by Turbonomic',
          columns: [
            {
              title: 'Set up integration',
              text: 'You can automate actions to comply with service level objectives and improve business efficiency.',
              link: {
                url: '#',
                label: 'Set up'
              }
            },
            {
              title: 'Upgrade to Instana Premium',
              text: 'You can automate actions to comply with service levels and improve business efficiency.',
              link: {
                url: '#',
                label: 'Upgrade'
              }
            },
            {
              title: 'View documentation',
              text: 'You can automate actions to comply with service levels and improve business efficiency.',
              link: {
                url: '#',
                label: 'View docs'
              }
            }
          ]
        }}
      />
      <div className={locals.charts}>
        <div className={locals.box1}>
          <ResultAwareChart
            result={success({})}
            config={{
              title: t('in-automation:actionCategory'),
              timeConfig: generateTimeframe(oneMinute),
              y1: {
                renderer: Renderer.pie,
                labels: ['Performance', 'Prevention', 'Efficiency', 'Savings', 'Compliance'],
                metricIds: [],
                metrics: generateMultipleMetrics(5, 30, 10, oneMinute),

                colors: colorPalette,
                formatter: ((x: any) => x) as unknown as FormatterObject
              }
            }}
          />
        </div>
        <div style={{ width: '65%', height: '295', display: 'none' }}>
          <ResultAwareChart
            result={success({})}
            config={{
              extendBar: true,
              granularity: granularity,
              title: 'Action types',
              timeConfig: timeConfig,
              y1: {
                renderer: Renderer.bar,
                labels: ['Type'],
                metricIds: ['Move', 'Buy', 'Save'],
                metrics: [generateMetrics(12, 100, oneMinute) as MetricDataSeries],
                colors: colorPalette
              }
            }}
          />
        </div>
        <div className={locals.box2}>
          <ResultAwareChart
            result={success({})}
            config={{
              title: 'Resource utilization',
              timeConfig: generateTimeframe(oneMinute),
              y1: {
                renderer: Renderer.stackedArea,
                labels: ['CPU', 'Memory', 'Disk'],
                metricIds: [],
                metrics: generateMultipleMetrics(3, 30, 10, oneMinute),
                colors: colorPalette
              }
            }}
          />
        </div>
      </div>
      <ServerTablePresenter<ScoredAction, RecommendedOptimizationsTableProps>
        columnDefinitions={columnDefinitions}
        volatileId={volatileId}
        event={event}
        trigger={trigger}
        fixedLayout
        leftHeader={
          <Typography variant="heading-300">
            {result?.progress?.loading
              ? t('in-automation:recommendedOptimizations')
              : t('in-automation:recommendedOptimizationsWithCount', { count: totalHits })}
          </Typography>
        }
        onChange={setServerTableUrlState}
        orderBy={orderBy}
        orderDirection={orderDirection}
        searchMaxWidth={180}
        page={page}
        pageSize={pageSize}
        query={query}
        result={result}
        rightHeader={
          <Stack direction="horizontal">
            <TypeFilter type={types} setType={params => setTypes({ types: params.types })} showExternal />
            <Spacer horizontal="small" />
          </Stack>
        }
        searchPlaceholder={t('in-automation:searchOptimizations')}
        onRowClick={!role?.canConfigureAutomationPolicies ? handleRowClick : undefined}
      />
    </div>
  );
}
