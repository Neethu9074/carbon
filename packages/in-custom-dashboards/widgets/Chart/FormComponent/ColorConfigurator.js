import classNames from 'classnames';
import React from 'react';

import groupedColorChoice from 'in-custom-dashboards/widgets/Chart/FormComponent/groupedColorChoice.png';
import { colors } from 'in-custom-dashboards/widgets/Chart/FormComponent/colors';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Tooltip from 'in-components/Tooltip';

import locals from './ColorConfigurator.mless';

export default function ColorConfigurator({ metricForm, index, indexInAxis, onChange, axisName }) {
  const isGrouped = metricForm.get('grouping')?.size > 0;
  if (isGrouped) {
    return (
      <Tooltip content="Colors for datasets leveraging groupings cannot be configured.">
        <DropdownButton disabled kind="secondary">
          <img
            className={locals.groupedColorChoice}
            src={groupedColorChoice}
            alt="Icon depicting automatic color selection."
          />
        </DropdownButton>
      </Tooltip>
    );
  }

  const field = metricForm.get('color');
  const usesAutomaticColor = !field.value;
  const activeColorId = usesAutomaticColor ? colors[index].id : field.value;

  return (
    <ComboBoxBehavior
      disableAutomaticOptionSorting
      value={activeColorId}
      options={[
        {
          value: '',
          label: 'Automatic'
        }
      ].concat(
        colors.map(({ id }) => ({
          value: id,
          label: <Color id={id} withLabel />
        }))
      )}
      onChange={color =>
        onChange([axisName, 'metrics', indexInAxis, 'color'], field => field.setValue(color).setTouched(true))
      }
      listItemAlignment="left"
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="secondary" expanded={isOpen}>
          <Color id={activeColorId} addAutomaticColorIndication={usesAutomaticColor} />
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function Color({ id, withLabel, addAutomaticColorIndication }) {
  const { color, label } = colors.find(c => c.id === id) || colors[0];
  let content = (
    <div
      className={classNames(locals.color, {
        [locals.withLabel]: withLabel
      })}
      style={{
        background: color
      }}
    />
  );

  if (addAutomaticColorIndication) {
    content = <Tooltip content="Color is automatically chosen">{content}</Tooltip>;
  }

  if (withLabel) {
    content = (
      <div className={locals.wrapper}>
        {content}
        {label}
      </div>
    );
  }

  return content;
}
