import PropTypes from 'prop-types';
import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './ChartSelectors.mless';

export function ComboChartMetricSelector({ metrics, selected, onChange }) {
  return (
    <ComboBoxBehavior
      value={selected}
      options={metrics.map(o => ({
        value: o.id || o.value,
        label: <div className={locals.comboOption}>{o.label}</div>
      }))}
      onChange={value => onChange(value)}
      disableAutomaticOptionSorting
      overlayAlignment="bottomRight"
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="subtle" size="compact" expanded={isOpen}>
          {metrics.find(o => (o.id || o.value) === selected).label}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

ComboChartMetricSelector.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // optional to disambiguate metrics with same metric value
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
        text: tab,
        key: tab,
        kind: 'primaryv2',
        onClick: () => {
          onChange(tab);
        }
      }))}
    />
  );
}

TabChartSelector.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
