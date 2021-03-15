/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BooleanBarGroupItem from 'in-analyze/components/filterBar/BooleanBarItem/BooleanBarGroupItem';
import MoreBarItem from 'in-analyze/components/filterBar/MoreBarItem';
import { entityTypes } from 'in-analyze/applicationFilter';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';
import { t } from 'in-i18n';

/**
 * A bar displaying toggles to switch between tag groups.
 * Only displays groups for which tags are available.
 */
export default function QuickGroupBar(props) {
  const { filters, grouping, clearTagGroup, onMoreClick, excludedTagFilters = [] } = props;

  const tagFilters = filters.tagFilter;
  const timeConfig = filters.timeConfig;
  const tagGroup = grouping?.by ?? null;

  const isNotExcluded = tagFilter => !excludedTagFilters.includes(tagFilter);

  const groupTags = [
    {
      tag: 'application.name',
      label: t('in-analyze:analyzeView.quickGroupBarLabelApplication'),
      entityType: entityTypes.DESTINATION
    },
    {
      tag: 'service.name',
      label: t('in-analyze:analyzeView.quickGroupBarLabelService'),
      entityType: entityTypes.DESTINATION
    },
    {
      tag: 'endpoint.name',
      label: t('in-analyze:analyzeView.quickGroupBarLabelEndpoint'),
      entityType: entityTypes.DESTINATION
    },
    {
      tag: 'call.type',
      label: t('in-analyze:analyzeView.quickGroupBarLabelType'),
      entityType: entityTypes.NOT_APPLICABLE
    },
    {
      tag: 'technology',
      label: t('in-analyze:analyzeView.quickGroupBarLabelTechnology'),
      entityType: entityTypes.DESTINATION
    }
  ];

  return (
    <Bar showClearFilters={false} onClearFilters={clearTagGroup} isGrouping>
      {groupTags.map(({ tag, label, entityType }) => {
        return (
          isNotExcluded(tag) && (
            <BooleanBarGroupItem
              {...props}
              timeConfig={timeConfig}
              tagFilters={tagFilters}
              tag={tag}
              singularLabel={label}
              activeTagGroup={tagGroup}
              entity={entityType}
              key={tag}
            />
          )
        );
      })}
      {onMoreClick && (
        <MoreBarItem {...props} onClick={onMoreClick} label={t('in-analyze:analyzeView.quickGroupBarLabelAllGroups')} />
      )}
    </Bar>
  );
}
