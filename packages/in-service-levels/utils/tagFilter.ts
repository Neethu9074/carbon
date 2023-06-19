/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  CustomEventBasedSli,
  isApplicationSloEntity,
  isCustomEventBasedSli,
  isEventBasedSli,
  isWebsiteSloEntity,
  ServiceLevelIndicator,
  ServiceLevelIndicatorUnion,
  SloEntityUnion,
  TagFilter,
  TagFilterExpression,
  TagFilterExpressionElementUnion
} from '@instana/types';

import { EQUALS, GREATER_THAN, LESS_OR_EQUAL_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import emptyTagFilterExpression from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { ServiceLevelErrors } from 'in-service-levels/constants';

interface CreateGoodBadTagFilterExpressionProps {
  indicator: ServiceLevelIndicatorUnion;
  entity: SloEntityUnion;
}

interface GoodBadTagFilterExpression {
  good: TagFilterExpressionElementUnion;
  bad: TagFilterExpressionElementUnion;
}

export function createGoodBadTagFilterExpression({
  indicator,
  entity
}: CreateGoodBadTagFilterExpressionProps): GoodBadTagFilterExpression {
  if (isCustomEventBasedSli(indicator)) {
    return getCustomEventBasedTagFilterExpression({ indicator });
  }

  if (isEventBasedSli(indicator)) {
    return getTagFilterExpressionFromBlueprint({ indicator, entity });
  }

  return { good: emptyTagFilterExpression, bad: emptyTagFilterExpression };
}

interface GetCustomEventBasedTagFilterExpressionProps {
  indicator: CustomEventBasedSli;
}

function getCustomEventBasedTagFilterExpression({
  indicator
}: GetCustomEventBasedTagFilterExpressionProps): GoodBadTagFilterExpression {
  const { goodEventsFilter, badEventsFilter } = indicator;
  const goodTagFilterExpression = goodEventsFilter ?? emptyTagFilterExpression;

  if (!badEventsFilter) {
    const badTagFilterConjunction = invertTagFilterExpression(goodTagFilterExpression);
    return {
      good: goodTagFilterExpression,
      bad: badTagFilterConjunction
    };
  }

  return {
    good: goodTagFilterExpression,
    bad: badEventsFilter
  };
}

const getBadEventsApplicationTagFilter = ({ blueprint, threshold }: ServiceLevelIndicator): TagFilter =>
  ({
    availability: tagFilter('call.erroneous', EQUALS, true),
    latency: tagFilter('call.latency', GREATER_THAN, threshold)
  }[blueprint]);

const getGoodEventsApplicationTagFilter = ({ blueprint, threshold }: ServiceLevelIndicator): TagFilter =>
  ({
    availability: tagFilter('call.erroneous', EQUALS, false),
    latency: tagFilter('call.latency', LESS_OR_EQUAL_THAN, threshold)
  }[blueprint]);

const getBadEventsWebsiteTagFilter = ({ blueprint, threshold }: ServiceLevelIndicator): TagFilter =>
  ({
    availability: tagFilter('beacon.erroneous', EQUALS, true),
    latency: tagFilter('beacon.duration', GREATER_THAN, threshold)
  }[blueprint]);

const getGoodEventsWebsiteTagFilter = ({ blueprint, threshold }: ServiceLevelIndicator): TagFilter =>
  ({
    availability: tagFilter('beacon.erroneous', EQUALS, false),
    latency: tagFilter('beacon.duration', LESS_OR_EQUAL_THAN, threshold)
  }[blueprint]);

interface GetTagFilterExpressionFromBlueprintProps {
  indicator: ServiceLevelIndicatorUnion;
  entity: SloEntityUnion;
}

function getTagFilterExpressionFromBlueprint({
  indicator,
  entity
}: GetTagFilterExpressionFromBlueprintProps): GoodBadTagFilterExpression {
  if (isApplicationSloEntity(entity)) {
    return {
      good: getGoodEventsApplicationTagFilter(indicator),
      bad: getBadEventsApplicationTagFilter(indicator)
    };
  }

  if (isWebsiteSloEntity(entity)) {
    return {
      good: getGoodEventsWebsiteTagFilter(indicator),
      bad: getBadEventsWebsiteTagFilter(indicator)
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

export function invertTagFilterExpression(_tagFilterExpression: TagFilterExpressionElementUnion): TagFilterExpression {
  throw new Error('not yet implemented');
}

export function toSimplifiedFormModelElements(tagFilterExpression: TagFilterExpression): FormModelElement[] {
  // Converting it forth and back is an easy way to remove unnecessary brackets.
  return fromBackendModel(toBackendQueryModel(fromBackendModel(tagFilterExpression)));
}
