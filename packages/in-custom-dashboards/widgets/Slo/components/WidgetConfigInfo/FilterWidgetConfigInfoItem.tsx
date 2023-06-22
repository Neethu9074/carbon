/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isUndefined } from 'lodash';
import React from 'react';

import { isTagFilter, isTagFilterExpression, TagFilterExpressionElementUnion } from '@instana/types';
import { StackItem } from '@instana/components';

import { useApplicationQueryBuilder } from 'in-service-levels/hooks/useApplicationQueryBuilder';
import { useWebsiteQueryBuilder } from 'in-service-levels/hooks/useWebsiteQueryBuilder';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';

import locals from './WidgetConfigInfo.mless';

interface ApplicationFilterWidgetConfigInfoItemProps {
  label: string;
  tagFilterExpression?: TagFilterExpressionElementUnion;
}

interface WebsiteFilterWidgetConfigInfoItemProps extends ApplicationFilterWidgetConfigInfoItemProps {
  beaconType?: string;
  websiteId?: string;
}

export function WebsiteFilterWidgetConfigInfoItem({
  label,
  beaconType,
  websiteId,
  tagFilterExpression
}: WebsiteFilterWidgetConfigInfoItemProps) {
  const { QueryBuilder } = useWebsiteQueryBuilder({ beaconType, websiteId });
  return (
    <FilterWidgetConfigInfoItem
      label={label}
      QueryBuilderComponent={QueryBuilder}
      tagFilterExpression={tagFilterExpression}
    />
  );
}

export const ApplicationFilterWidgetConfigInfoItem = ({
  label,
  tagFilterExpression
}: ApplicationFilterWidgetConfigInfoItemProps) => {
  const { QueryBuilder } = useApplicationQueryBuilder({});
  return (
    <FilterWidgetConfigInfoItem
      label={label}
      QueryBuilderComponent={QueryBuilder}
      tagFilterExpression={tagFilterExpression}
    />
  );
};

interface FilterWidgetConfigInfoItemProps {
  label: string;
  QueryBuilderComponent: QueryBuilderComponent;
  tagFilterExpression?: TagFilterExpressionElementUnion;
}

export default function FilterWidgetConfigInfoItem({
  label,
  QueryBuilderComponent,
  tagFilterExpression
}: FilterWidgetConfigInfoItemProps) {
  if (!isValidFilter(tagFilterExpression)) return <></>;

  return (
    <StackItem>
      <div className={locals.configLabel}>{label}</div>
      <div className={locals.configValue}>
        <QueryBuilderComponent value={fromBackendModel(tagFilterExpression)} readOnly />
      </div>
    </StackItem>
  );
}

function isNonEmptyTagFilterExpression(tagFilterExpression: TagFilterExpressionElementUnion): boolean {
  return isTagFilterExpression(tagFilterExpression) && tagFilterExpression.elements.length !== 0;
}

function isValidFilter(tagFilterExpression?: TagFilterExpressionElementUnion): boolean {
  if (isUndefined(tagFilterExpression)) return false;

  return isTagFilter(tagFilterExpression) || isNonEmptyTagFilterExpression(tagFilterExpression);
}
