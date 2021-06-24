/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Toggle, Spacer } from '@instana/components';

import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Select from 'in-components/form/Select';
import { t } from 'in-i18n';

import locals from './GroupingConfiguration.mless';

const maxGroupingsAvailable = [5, 10, 20, 50];

export default function GroupingConfiguration({
  withGrouping,
  grouping,
  tagFilterExpressionField,
  onByChange,
  onDirectionChange,
  onIncludeOthersChange,
  GroupingConfigurator,
  hasError,
  additionalContent,
  withOptionalMarker,
  hideIncludeOthersToggle,
  maxGrouping = 20
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
            hasError={hasError}
            additionalContent={additionalContent}
            withOptionalMarker={withOptionalMarker}
          />

          {grouping && (
            <Section useAlternateBg>
              <div className={locals.wrapper}>
                <Select
                  id="select-top-groups"
                  value={grouping.direction + '-' + grouping.maxResults}
                  onChange={e => {
                    const [direction, maxResults] = e.target.value.split('-');
                    onDirectionChange(direction, parseInt(maxResults));
                  }}
                >
                  {maxGroupingsAvailable
                    .filter(m => m <= maxGrouping)
                    .map(number => (
                      <option key={`DESC-${number}`} value={`DESC-${number}`}>
                        {t('in-custom-dashboards:widgets.metricConfig.groupingConfig.top', { number })}
                      </option>
                    ))}
                  {maxGroupingsAvailable
                    .filter(m => m <= maxGrouping)
                    .map(number => (
                      <option key={`ASC-${number}`} value={`ASC-${number}`}>
                        {t('in-custom-dashboards:widgets.metricConfig.groupingConfig.bottom', { number })}
                      </option>
                    ))}
                </Select>
                {!hideIncludeOthersToggle && (
                  <>
                    <Toggle
                      className={locals.toggle}
                      id="select-top-groups-display-sum-others"
                      checked={grouping.includeOthers}
                      onChange={e => onIncludeOthersChange(e.target.checked)}
                    />
                    <Spacer horizontal="xxsmall" />
                    {t('in-custom-dashboards:widgets.metricConfig.groupingConfig.showRemainingGroupsAggregOther')}
                  </>
                )}
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
    includeOthers: PropTypes.any,
    maxResults: PropTypes.number
  }),
  onByChange: PropTypes.func.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  onIncludeOthersChange: PropTypes.func.isRequired,
  tagFilterExpressionField: PropTypes.shape({
    valid: PropTypes.any,
    value: PropTypes.any
  }).isRequired,
  withGrouping: PropTypes.bool,
  withOptionalMarker: PropTypes.bool,
  hasError: PropTypes.bool,
  additionalContent: PropTypes.node,
  hideIncludeOthersToggle: PropTypes.bool,
  maxGrouping: PropTypes.number.isRequired
};
