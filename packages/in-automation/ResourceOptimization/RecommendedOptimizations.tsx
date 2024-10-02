/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import {
  actionCategoryColumn,
  nameColumn,
  impactedServicesColumn
} from 'in-automation/ResourceOptimization/columnDefinitions';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { usePaginatedResourceOptimizations } from 'in-automation/AutomationCard/useScoredActions';
import { generateMetrics, fixedTimestamp } from 'in-test/util/generateMetrics';
import { FormatterObject, MetricDataSeries } from 'in-components/Chart/types';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import InfoPanel from 'in-automation/components/InfoPanel/InfoPanel';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { RecommendedAction, Result } from 'in-types';
import { chartColors } from 'in-themes/chartColors';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './RecommendedOptimizations.mless';

const pathSegment = '/RecommendedOptimizations';
const matrixPrefix = '';

const columnDefinitions: ColumnDefinition<RecommendedAction, RecommendedOptimizationsTableProps>[] = [
  nameColumn,
  impactedServicesColumn,
  actionCategoryColumn
];
/*
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
}*/

interface RecommendedOptimizationsTableProps extends ServerTablePresenterProps<RecommendedAction> {}

interface RecommendedOptimizationsProps {
  recommendedActions: Result<RecommendedAction[]>;
  totalRecommendedActions: number;
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
  recommendedActions,
  totalRecommendedActions
}: RecommendedOptimizationsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection } = serverTableUrlState;

  const result = usePaginatedResourceOptimizations({
    recommendedActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  const colorPalette = [
    chartColors.fiveColorPalette[1],
    chartColors.fiveColorPalette[2],
    chartColors.fiveColorPalette[0],
    chartColors.fiveColorPalette[3],
    chartColors.fiveColorPalette[4]
  ];

  const totalHits = totalRecommendedActions;

  //TODO update with modal code
  const handleRowClick = () => {};

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
      <ServerTablePresenter<RecommendedAction, RecommendedOptimizationsTableProps>
        columnDefinitions={columnDefinitions}
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
        result={result}
        rightHeader={null}
        searchPlaceholder={t('in-automation:searchOptimizations')}
        onRowClick={handleRowClick}
        tableInCard={false}
      />
    </div>
  );
}
