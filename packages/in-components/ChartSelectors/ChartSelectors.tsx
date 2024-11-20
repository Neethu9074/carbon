/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { ButtonGroup, CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem } from '@instana/components';

import { urlParameter as timeShiftUrlParameter } from 'in-stores/time/shifting';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './ChartSelectors.mless';

interface MetricsProps {
  id: string;
  label: any;
  value: string;
  tab: string;
  tabDefault?: boolean;
}

interface TabProps {
  id: string;
  label: string;
}
interface TimeShiftAwareChartSelectorWithUrlStateProps {
  cardTitle: string;
  tabs: TabProps[];
  metrics: MetricsProps[];
  urlMatrixParamConfig: {
    path: string;
    paramTab: string;
    paramMetric: string;
  };
  disabledWidgetInLive?: boolean;
  children: React.ReactElement;
}

// The child components will receive these additional properties.
// - selectedTab: The ID of the selected tab.
// - selectedMetric: The ID of the selected metric which should be shown, when time shift is on.
// - timeShiftConfig: Time shift configuration object. For consistency, child components should
// use this object rather than using the useTimeShiftConfig() hook directly.
export function TimeShiftAwareChartSelectorWithUrlState({
  cardTitle,
  tabs,
  metrics,
  urlMatrixParamConfig: { path, paramTab, paramMetric },
  disabledWidgetInLive,
  children
}: TimeShiftAwareChartSelectorWithUrlStateProps): JSX.Element {
  // find the default metric of the specified tab
  const findDefaultMetricByTab = (tabId: string) =>
    metrics.find((m: MetricsProps) => m.tab === tabId && m.tabDefault)?.id ??
    // otherwise, take the default metric of the first tab
    metrics.find((m: MetricsProps) => m.tab === tabs[0].id && m.tabDefault)?.id ??
    // otherwise, take the first metric of the first tab
    metrics.find((m: MetricsProps) => m.tab === tabs[0].id)?.id;
  const findTabByMetric = (metricId: string) => metrics.find((m: MetricsProps) => m.id === metricId)?.tab ?? tabs[0].id;

  const timeShiftConfig = useTimeShiftConfig();
  const timeShiftEnabled = timeShiftConfig.offset !== 0;
  const urlStateDefinition = {
    bind: [
      {
        path: path,
        name: paramTab,
        as: paramTab
      },
      {
        path: path,
        name: paramMetric,
        as: paramMetric
      }
    ],
    resets: [
      {
        bind: [timeShiftUrlParameter],
        reset: ({ timeShiftOffset }: any): any => {
          if (timeShiftOffset === 0) {
            return { [paramTab]: getActiveTab(), [paramMetric]: null };
          } else {
            return { [paramMetric]: getActiveMetric(), [paramTab]: null };
          }
        }
      }
    ]
  };

  const [{ [paramTab]: activeTab, [paramMetric]: activeMetric }, setUrlState] = useUrlState(urlStateDefinition);
  const setActiveTab = (tab: string) => setUrlState({ [paramTab]: tab, [paramMetric]: null });
  const setActiveMetric = (metric: string | undefined) => setUrlState({ [paramMetric]: metric, [paramTab]: null });

  const getActiveTab = () => activeTab ?? findTabByMetric(activeMetric);
  const getActiveMetric = () => activeMetric ?? findDefaultMetricByTab(activeTab);

  useEffect(() => {
    if (timeShiftEnabled) {
      if (!metrics.find(m => m.id === activeMetric)) {
        // make sure the activeMetric is still available
        setActiveMetric(findDefaultMetricByTab(activeTab));
      }
    } else {
      if (!tabs.find(t => t.id === activeTab)) {
        // make sure the activeTab is still available
        setActiveTab(findTabByMetric(activeMetric));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, metrics]);

  const selectorComponent = timeShiftEnabled ? (
    <ComboChartMetricSelector metrics={metrics} selected={getActiveMetric()} onChange={setActiveMetric} />
  ) : (
    tabs.length > 1 && (
      <TabChartSelector
        cardTitle={cardTitle}
        tabs={tabs}
        selected={getActiveTab()}
        onChange={setActiveTab}
        disabledWidgetInLive={disabledWidgetInLive}
      />
    )
  );

  // pass these additional props to the children
  const additionalProps = {
    selectedTabId: timeShiftEnabled ? findTabByMetric(getActiveMetric()) : getActiveTab(),
    selectedMetricValue: metrics.find((m: MetricsProps) => m.id === getActiveMetric())?.value,
    timeShiftConfig: timeShiftConfig,
    selectorComponent: selectorComponent,
    cardTitle: cardTitle
  };

  const childrenWithProps = React.Children.map(children, (child: React.ReactElement) => {
    if (!child) {
      return null;
    }
    return (
      <child.type {...child.props} {...additionalProps}>
        {child}
      </child.type>
    );
  });

  return <React.Fragment>{childrenWithProps}</React.Fragment>;
}
interface ComboChartMetricSelectorProps {
  metrics: MetricsProps[];
  selected: string;
  onChange: (value: string) => void;
}

export function ComboChartMetricSelector({
  metrics,
  selected,
  onChange
}: ComboChartMetricSelectorProps): React.ReactElement {
  return (
    <MenuButton
      kind="ghost"
      size="sm"
      label={metrics.find((o: MetricsProps) => o.id === selected)?.label}
      title={t('in-components:chartingConfigurator.labelChangeSelectedMetric')}
      menuAlignment="bottom-start"
    >
      {metrics.map((o: MetricsProps) => {
        return (
          <MenuItem
            key={o.id}
            label={o.label}
            onClick={() => onChange(o.id)}
            className={o.id === selected ? locals.selected : undefined}
          />
        );
      })}
    </MenuButton>
  );
}

interface TabChartSelectorProps {
  tabs: TabProps[];
  selected: string;
  onChange: (tabId: string) => void;
  disabledWidgetInLive?: boolean;
  cardTitle?: string;
}

export function TabChartSelector({ tabs, selected, onChange, disabledWidgetInLive, cardTitle }: TabChartSelectorProps) {
  const cardTitleAlphanumeric = (cardTitle || '').replace(/[^a-zA-Z\d]/g, '');
  return (
    <ButtonGroup
      id={`button-group-${cardTitleAlphanumeric}`}
      activeKey={selected}
      disabledWidgetInLive={disabledWidgetInLive}
      buttonPropsList={tabs.map((tab: TabProps) => ({
        text: tab.label,
        key: tab.id,
        kind: 'primaryv2',
        onClick: () => {
          onChange(tab.id);
        }
      }))}
    />
  );
}
