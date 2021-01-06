import PropTypes from 'prop-types';
import React from 'react';

import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import Select from 'in-components/form/Select';
import Toggle from 'in-components/form/Toggle';

import locals from './GroupingConfiguration.mless';

export default function GroupingConfiguration({
  withGrouping,
  grouping,
  tagFilterExpressionField,
  onByChange,
  onDirectionChange,
  onIncludeOthersChange,
  GroupingConfigurator
}) {
  return (
    <>
      {withGrouping && (
        <Sections>
          <GroupingConfiguratorSection
            value={grouping?.by}
            GroupingConfigurator={GroupingConfigurator}
            tagFilterExpression={tagFilterExpressionField.valid ? tagFilterExpressionField.value : EMPTY_EXPRESSION}
            onChange={group => onByChange(group)}
            withoutIcon
          />

          {grouping && (
            <Section useAlternateBg>
              <div className={locals.wrapper}>
                <Select
                  id="select-top-groups"
                  value={grouping.direction}
                  onChange={e => {
                    onDirectionChange(e.target.value);
                  }}
                >
                  <option value="DESC">Top 5</option>
                  <option value="ASC">Bottom 5</option>
                </Select>
                <Toggle
                  className={locals.toggle}
                  id="select-top-groups-display-sum-others"
                  checked={grouping.includeOthers}
                  onChange={e => onIncludeOthersChange(e.target.checked)}
                />
                Display aggregation of other groups
              </div>
            </Section>
          )}
        </Sections>
      )}
    </>
  );
}

GroupingConfiguration.propTypes = {
  GroupingConfigurator: PropTypes.elementType.isRequired,
  grouping: PropTypes.shape({
    by: PropTypes.any,
    direction: PropTypes.any,
    includeOthers: PropTypes.any
  }),
  onByChange: PropTypes.func.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  onIncludeOthersChange: PropTypes.func.isRequired,
  tagFilterExpressionField: PropTypes.shape({
    valid: PropTypes.any,
    value: PropTypes.any
  }).isRequired,
  withGrouping: PropTypes.bool
};
