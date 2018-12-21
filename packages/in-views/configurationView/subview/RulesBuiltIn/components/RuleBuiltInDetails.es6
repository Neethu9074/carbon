import React from 'react';

import { valueWithFormatterToReadableString } from 'in-services/formatters/number';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';

import './RuleBuiltInDetails.less';

const block = 'in-built-in-rule-details';

export default function Details({ rule }) {
  if (!rule) {
    return null;
  }

  const entityType = rule.get('shortPluginId');

  return (
    <div className={block}>
      <DescriptionList>
        <DescriptionItem title="Entity type">
          <div className={`${block}__flex-wrapper`}>
            <PluginIcon className={`${block}__entity-icon`} dimension={16} color="#000" plugin={entityType} />
            {getSingular(entityType)}
          </div>
        </DescriptionItem>
        <DescriptionItem title="Description">{rule.get('description')}</DescriptionItem>
        {rule.get('hyperParams').size > 0 && (
          <DescriptionItem title="Parameters">
            <ul>
              {rule.get('hyperParams').map((param, i) => {
                const value = param.get('defaultValue');
                const valueFormat = param.get('valueFormat');
                const formattedValue = valueWithFormatterToReadableString(value, valueFormat);
                return (
                  <li key={i}>
                    {param.get('name')} - {formattedValue}
                  </li>
                );
              })}
            </ul>
          </DescriptionItem>
        )}
        <DescriptionItem title="Last update">{formatDateTime(rule.get('lastUpdated'))}</DescriptionItem>
      </DescriptionList>
    </div>
  );
}
