/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Observable } from '@instana/observables';

import { fromBackendModel, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { BeaconType, Group, TagCatalog, TagFilterExpressionElementUnion, TimeConfig } from 'in-types';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { ChartedMetric, Fields } from 'in-websites/navigation/paths';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { hasError, isLoading } from 'in-services/util/result';
import getWebsite from 'in-websites/subscriptions/getWebsite';

interface GetLinkToWebsiteAnalyzeProps {
  websiteId: string;
  beaconType: BeaconType;
  timeConfig?: TimeConfig;
  tagCatalog?: TagCatalog;
  filterExpression?: TagFilterExpressionElementUnion;
  chartedMetrics?: ChartedMetric[];
  fields?: Fields[];
}

export default function getLinkToWebsiteAnalyze({
  websiteId,
  beaconType,
  timeConfig,
  tagCatalog,
  filterExpression,
  chartedMetrics,
  fields
}: GetLinkToWebsiteAnalyzeProps): Observable<string> {
  return getWebsite({ id: websiteId! })
    .filter(result => !isLoading(result) && !hasError(result))
    .flatMap(({ data }) => {
      const formModel = joinExpressions({
        logicalOperator: 'AND',
        expressions: [
          fromBackendModel(tagFilter('beacon.website.name', 'EQUALS', data!.label)),
          fromBackendModel(filterExpression)
        ]
      });

      // for some reason Analytics shows an error if groupbyTagEntity is provided even if it's NOT_APPLICABLE
      // default groupings also have no groupbyTagEntity available - see: in-websites/tags.js
      const groupBy = { groupbyTag: 'beacon.location.url' } as Group;

      return getLinkToAnalyze({
        beaconType,
        groupBy,
        formModel,
        tagCatalog,
        timeConfig,
        chartedMetrics,
        fields
      });
    });
}
