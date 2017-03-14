import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDurationAccurately} from 'in-services/formatters/date';
import {formatDateTime} from 'in-services/formatters/date';
import {getRule} from 'in-services/groundskeeper/rules';
import PluginIcon from 'in-components/PluginIcon';
import {getSingular} from 'in-sdk/pluginName';
import {getCategories} from 'in-sdk/metrics';
import connectTo from 'in-hoc/connectTo';

import './RuleDetails.less';


const block = 'in-rule-details';

export default connectTo(props => {
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
function Details({rule}) {
  if (!rule) {
    return null;
  }

  return (
    <div className={block}>
      <DescriptionList>
        <DescriptionItem title='Entity type'>
          <div className={`${block}__flex-wrapper`}>
            <PluginIcon className={`${block}__entity-icon`}
                        dimension={16}
                        color='#000'
                        plugin={rule.get('entityType')} />
            {getSingular(rule.get('entityType'))}
          </div>
        </DescriptionItem>
        <DescriptionItem title='Metric'>
          {getMetricLabel(rule)}
        </DescriptionItem>
        <DescriptionItem title='Time window'>
          {formatDurationAccurately(rule.get('window'), 1000)}
        </DescriptionItem>
        <DescriptionItem title='Aggregation'>
          {rule.get('aggregation')}
        </DescriptionItem>
        <DescriptionItem title='Condition'>
          {`${rule.get('conditionOperator')} ${rule.get('conditionValue')}`}
        </DescriptionItem>

        <DescriptionItem title='Last update'>
          {formatDateTime(rule.get('lastUpdated'))}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
});

function getMetricLabel(rule) {
  const metric = rule.get('metricName');
  const categoryTree = getCategories(rule.get('entityType'));
  for (let i = 0, length = categoryTree.length; i < length; i++) {
    const categoryNode = categoryTree[i];
    if (categoryNode.type === 'metric') {
      if (categoryNode.metric === metric) {
        return categoryNode.label;
      }
    } else {
      for (let j = 0, lengthJ = categoryNode.children.length; j < lengthJ; j++) {
        if(categoryNode.children[j].metric === metric) {
          return categoryNode.children[j].label;
        }
      }
    }
  }
}
