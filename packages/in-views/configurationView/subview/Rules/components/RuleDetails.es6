import React from 'react';

import { getCategories, getPlainMetricList } from 'in-sdk/metrics';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { formatDateTime } from 'in-services/formatters/date';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';
import { find } from 'in-services/arrayUtils';
import connectTo from 'in-hoc/connectTo';
import { getRule } from 'in-api/rules';

import './RuleDetails.less';

const block = 'in-rule-details';

export default connectTo(
  props => {
    if (props.rule) {
      return {};
    }
    if (props.ruleId && props.ruleId.length > 0) {
      return {
        rule: getRule(props.ruleId)
      };
    }
    return {};
  },
  function Details({ rule }) {
    if (!rule) {
      return null;
    }

    const entityType = rule ? rule.get('entityType') : '';
    const metricName = rule ? rule.get('metricName') : '';
    let formatter = rule ? rule.get('formatter') : 'UNDEFINED';

    // FIXME fallback is only needed as long as not all plugins define a built-in metrics-catalog
    if (rule && formatter === 'UNDEFINED') {
      const metricList = getPlainMetricList(entityType);
      const metricItem = find(metricList, _metric => _metric.value === metricName);

      if (metricItem) {
        formatter = numberFormatterToFormatterType(metricItem.formatter);
      }
    }

    const valueUnit = formatterTypeToLabel(formatter);
    let conditionValue = rule.get('conditionValue');
    conditionValue = mapConditionValue(conditionValue, formatter);

    return (
      <div className={block}>
        <DescriptionList>
          <DescriptionItem title="Entity type">
            <div className={`${block}__flex-wrapper`}>
              <PluginIcon
                className={`${block}__entity-icon`}
                dimension={16}
                color="#000"
                plugin={rule.get('entityType')}
              />
              {getSingular(rule.get('entityType'))}
            </div>
          </DescriptionItem>
          <DescriptionItem title="Metric">{getMetricLabel(rule)}</DescriptionItem>
          <DescriptionItem title="Time window">{formatDurationAccurately(rule.get('window'), 1000)}</DescriptionItem>
          <DescriptionItem title="Aggregation">{rule.get('aggregation')}</DescriptionItem>
          <DescriptionItem title="Condition">
            {`${rule.get('conditionOperator')} ${conditionValue} ${valueUnit}`}
          </DescriptionItem>

          <DescriptionItem title="Last update">{formatDateTime(rule.get('lastUpdated'))}</DescriptionItem>

          {instanaInternalFeaturesEnabled ? (
            <DescriptionItem title="technical metric name">{rule.get('metricName')}</DescriptionItem>
          ) : null}
        </DescriptionList>
      </div>
    );
  }
);

function getMetricLabel(rule) {
  const metric = rule.get('metricName');
  const categoryTree = getCategories(rule.get('entityType'));
  for (let i = 0, length = categoryTree.length; i < length; i++) {
    const categoryNode = categoryTree[i];
    if (categoryNode.type === 'metric') {
      if (categoryNode.metric === metric) {
        return `${categoryNode.label} (${categoryNode.metric})`;
      }
    } else {
      for (let j = 0, lengthJ = categoryNode.children.length; j < lengthJ; j++) {
        if (categoryNode.children[j].metric === metric) {
          return `${categoryNode.children[j].label} (${categoryNode.children[j].metric})`;
        }
      }
    }
  }
}

export function formatterTypeToLabel(formatterType) {
  switch (formatterType) {
    case 'MILLIS':
      return 'ms';
    case 'PERCENTAGE':
      return '%';
    case 'RATE':
      return '/s';
    case 'BYTE_RATE':
      return 'Bytes/s';
    case 'BYTES':
      return 'Bytes';
    case 'UNDEFINED':
    case 'NUMBER':
    default:
      return '';
  }
}

export function mapConditionValue(value, formatterType) {
  if (formatterType === 'PERCENTAGE') {
    // we use a scale of [0, 100.0], but we only store the value in range [0, 1.0]
    value *= 100;
  } else if (formatterType === 'MUSECONDS') {
    // convert to millis
    value /= 1000;
  }
  return value;
}

export function unmapConditionValue(value, formatterType) {
  if (formatterType === 'PERCENTAGE') {
    value /= 100;
  } else if (formatterType === 'MUSECONDS') {
    value *= 1000;
  }
  return value;
}
