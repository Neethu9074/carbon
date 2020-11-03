import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { urlParameter as timeShiftUrlParameter } from 'in-stores/time/shifting';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import ButtonGroup from 'in-new-components/ButtonGroup';
import useUrlState from 'in-hooks/useUrlState';
import Card from 'in-new-components/Card';

import locals from './ChartSelectors.mless';

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
  children
}) {
  // find the default metric of the specified tab
  const findDefaultMetricByTab = tabId =>
    metrics.find(m => m.tab === tabId && m.tabDefault)?.id ??
    // otherwise, take the default metric of the first tab
    metrics.find(m => m.tab === tabs[0].id && m.tabDefault)?.id ??
    // otherwise, take the first metric of the first tab
    metrics.find(m => m.tab === tabs[0].id).id;
  const findTabByMetric = metricId => metrics.find(m => m.id === metricId)?.tab ?? tabs[0].id;

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
        reset: ({ timeShiftOffset }) => {
          if (timeShiftOffset !== 0) {
            return { [paramMetric]: findDefaultMetricByTab(activeTab), [paramTab]: null };
          } else {
            return { [paramTab]: findTabByMetric(activeMetric), [paramMetric]: null };
          }
        }
      }
    ]
  };

  const [{ [paramTab]: activeTab, [paramMetric]: activeMetric }, setUrlState] = useUrlState(urlStateDefinition);

  const setActiveTab = tab => setUrlState({ [paramTab]: tab, [paramMetric]: null });
  const setActiveMetric = metric => setUrlState({ [paramMetric]: metric, [paramTab]: null });

  const getActiveTab = () => activeTab || findTabByMetric(activeMetric);
  const getActiveMetric = () => activeMetric || findDefaultMetricByTab(activeTab);

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
  }, [tabs, metrics]);

  const selectorComponent = timeShiftEnabled ? (
    <ComboChartMetricSelector metrics={metrics} selected={getActiveMetric()} onChange={setActiveMetric} />
  ) : (
    tabs.length > 1 && <TabChartSelector tabs={tabs} selected={getActiveTab()} onChange={setActiveTab} />
  );

  // pass these additional props to the children
  const additionalProps = {
    selectedTabId: timeShiftEnabled ? findTabByMetric(getActiveMetric()) : getActiveTab(),
    selectedMetricValue: metrics.find(m => m.id === getActiveMetric())?.value,
    timeShiftConfig: timeShiftConfig
  };

  const childrenWithProps = React.Children.map(children, child => {
    return (
      <child.type {...child.props} {...additionalProps}>
        {child}
      </child.type>
    );
  });

  return (
    <Card title={cardTitle} header={selectorComponent}>
      {childrenWithProps}
    </Card>
  );
}

TimeShiftAwareChartSelectorWithUrlState.propTypes = {
  cardTitle: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      tab: PropTypes.string.isRequired,
      tabDefault: PropTypes.bool
    })
  ).isRequired,
  urlMatrixParamConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    paramTab: PropTypes.string.isRequired,
    paramMetric: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.element.isRequired
};

export function ComboChartMetricSelector({ metrics, selected, onChange }) {
  return (
    <ComboBoxBehavior
      value={selected}
      options={metrics.map(o => ({
        value: o.id,
        label: <div className={locals.comboOption}>{o.label}</div>
      }))}
      onChange={value => onChange(value)}
      disableAutomaticOptionSorting
      overlayAlignment="bottomRight"
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="subtle" size="compact" expanded={isOpen}>
          {metrics.find(o => o.id === selected)?.label}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

ComboChartMetricSelector.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export function TabChartSelector({ tabs, selected, onChange }) {
  return (
    <ButtonGroup
      activeKey={selected}
      buttonPropsList={tabs.map(tab => ({
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

TabChartSelector.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequire
    })
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
