/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonDropdown as Dropdown } from '@instana/components';

import groupedColorChoice from 'in-custom-dashboards/widgets/Chart/FormComponent/groupedColorChoice.png';
import { colors } from 'in-custom-dashboards/widgets/Chart/FormComponent/colors';
import { t } from 'in-i18n';

import locals from './ColorConfigurator.mless';

export default function ColorConfigurator({ metricForm, index, indexInAxis, onChange, axisName }) {
  const isGrouped = metricForm.get('grouping')?.size > 0;
  const nonLegacyColors = colors.filter(i => !i.legacy);
  const field = metricForm.get('color');
  const usesAutomaticColor = !field.value;
  const activeColorId = usesAutomaticColor ? nonLegacyColors[index % nonLegacyColors.length].id : field.value;

  const groupedLabel = (
    <img
      className={locals.groupedColorChoice}
      src={groupedColorChoice}
      alt={t('in-custom-dashboards:widgets.formCompChart.colorConfiguratorChart.iconDepicAutoColorSelect')}
      title={t('in-custom-dashboards:widgets.formCompChart.colorConfiguratorChart.colorDsGrpNotConfig')}
    />
  );

  const options = isGrouped
    ? [
        {
          label: groupedLabel,
          value: 'grouped'
        }
      ]
    : [
        {
          value: '',
          label: t('in-custom-dashboards:widgets.formCompChart.colorConfiguratorChart.automatic')
        }
      ].concat(
        colors.map(({ id }) => ({
          value: id,
          label: <Color id={id} withLabel />
        }))
      );

  const getTitle = () => {
    const { label } = colors.find(c => c.id === field.value) || colors[0];
    let title = usesAutomaticColor
      ? t('in-custom-dashboards:widgets.formCompChart.colorConfiguratorChart.colorAutoChose')
      : label;
    if (isGrouped) title = t('in-custom-dashboards:widgets.formCompChart.colorConfiguratorChart.colorDsGrpNotConfig');
    return title;
  };

  const findOption = colorfield => {
    return colorfield
      ? options.find(ele => {
          return ele.value === colorfield.value;
        })
      : null;
  };

  return (
    <Dropdown
      id="color-config"
      items={options}
      disabled={isGrouped}
      titleText={getTitle()}
      selectedItem={isGrouped ? options[0] : findOption(field)}
      label={getTitle()}
      onChange={event => {
        const color = event?.selectedItem?.value;
        onChange([axisName, 'metrics', indexInAxis, 'color'], field => field.setValue(color).setTouched(true));
      }}
      initialSelectedItem={isGrouped ? options[0] : findOption(field)}
      itemToElement={item => {
        return item.label;
      }}
      itemToString={item => {
        return item.id;
      }}
      renderSelectedItem={() => {
        return isGrouped ? groupedLabel : <Color id={activeColorId} title={getTitle()} />;
      }}
      type="inline"
      hideLabel
      autoAlign
    />
  );
}

function Color({ id, withLabel, title }) {
  const { color, label } = colors.find(c => c.id === id) || colors[0];
  let content = (
    <div
      title={title}
      className={classNames(locals.color, {
        [locals.withLabel]: withLabel
      })}
      style={{
        background: color
      }}
    />
  );

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
