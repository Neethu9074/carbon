/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  ApplicationSloEntity,
  AvailabilityBlueprintIndicator,
  CustomBlueprintIndicator,
  LatencyBlueprintIndicator,
  SyntheticSloEntity,
  WebsiteSloEntity
} from '@instana/types';

import { EQUALS, GREATER_THAN, LESS_OR_EQUAL_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { statusTagName } from 'in-synthetics/tags';

describe('in-service-levels/utils/tagFilter', () => {
  it('returns default TagFilterExpressions for good and bad events when a time-based SLI is provided', () => {
    // Given
    const indicator: AvailabilityBlueprintIndicator = {
      blueprint: 'availability',
      threshold: 0.9,
      type: 'timeBased',
      aggregation: 'P90'
    };

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'someWebsiteId'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual(tagFilter('beacon.erroneous', 'EQUALS', false));
    expect(bad).toEqual(tagFilter('beacon.erroneous', 'EQUALS', true));
  });

  it('returns good and bad events filter for custom event-based SLIs when badEventsFilter configuration is missing', () => {
    // Given
    const indicator: CustomBlueprintIndicator = {
      threshold: 0.0,
      blueprint: 'custom',
      type: 'eventBased',
      goodEventsFilter: tagFilter('beacon.http.status', 'EQUALS', 200)
    };

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'someWebsiteId'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual(tagFilter('beacon.http.status', 'EQUALS', 200));
    expect(bad).toEqual(tagFilter('beacon.http.status', 'NOT_EQUAL', 200));
  });

  it('returns good and bad events filter for custom event-based SLIs when badEventsFilter is configured', () => {
    // Given
    const indicator: CustomBlueprintIndicator = {
      threshold: 0.0,
      blueprint: 'custom',
      type: 'eventBased',
      goodEventsFilter: tagFilter('beacon.http.status', 'EQUALS', 200),
      badEventsFilter: tagFilter('beacon.http.status', 'GREATER_OR_EQUAL_THAN', 500)
    };

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'someWebsiteId'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.http.status',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: 200
    });
    expect(bad).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.http.status',
      operator: 'GREATER_OR_EQUAL_THAN',
      type: 'TAG_FILTER',
      value: 500
    });
  });

  it('returns good and bad events filter for entity of type application with event-based latency SLIs', () => {
    // Given
    const indicator: LatencyBlueprintIndicator = {
      blueprint: 'latency',
      threshold: 0.9,
      type: 'eventBased'
    };

    const entity: ApplicationSloEntity = {
      type: 'application',
      applicationId: 'someApplicationId',
      boundaryScope: 'ALL'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'call.latency',
      operator: 'LESS_OR_EQUAL_THAN',
      type: 'TAG_FILTER',
      value: 0.9
    });
    expect(bad).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'call.latency',
      operator: 'GREATER_THAN',
      type: 'TAG_FILTER',
      value: 0.9
    });
  });

  it('returns good and bad events filter for entity of type application with event-based availability SLIs', () => {
    // Given
    const indicator: AvailabilityBlueprintIndicator = {
      blueprint: 'availability',
      threshold: 0.9,
      type: 'eventBased'
    };

    const entity: ApplicationSloEntity = {
      type: 'application',
      applicationId: 'someApplicationId',
      boundaryScope: 'ALL'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'call.erroneous',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: false
    });
    expect(bad).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'call.erroneous',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: true
    });
  });

  it('returns good and bad events filter for entity of type website with event-based latency SLIs', () => {
    // Given
    const indicator: LatencyBlueprintIndicator = {
      blueprint: 'latency',
      threshold: 0.9,
      type: 'eventBased'
    };

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'someWebsiteId'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.duration',
      operator: 'LESS_OR_EQUAL_THAN',
      type: 'TAG_FILTER',
      value: 0.9
    });
    expect(bad).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.duration',
      operator: 'GREATER_THAN',
      type: 'TAG_FILTER',
      value: 0.9
    });
  });

  it('returns good and bad events filter for entity of type website with event-based availability SLIs', () => {
    // Given
    const indicator: AvailabilityBlueprintIndicator = {
      blueprint: 'availability',
      threshold: 0.9,
      type: 'eventBased'
    };

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'someWebsiteId'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.erroneous',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: false
    });
    expect(bad).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.erroneous',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: true
    });
  });

  it('returns good and bad events filter for entity with time-based SLIs', () => {
    // Given
    const indicator: AvailabilityBlueprintIndicator = {
      blueprint: 'availability',
      threshold: 0.9,
      aggregation: 'P90',
      type: 'timeBased'
    };

    const entity: WebsiteSloEntity = {
      type: 'website',
      beaconType: 'httpRequest',
      websiteId: 'someWebsiteId'
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.erroneous',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: false
    });
    expect(bad).toEqual({
      entity: 'NOT_APPLICABLE',
      name: 'beacon.erroneous',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      value: true
    });
  });

  it('returns good and bad events filter for an event-based latency synthetic SLO ', () => {
    // Given
    const indicator: LatencyBlueprintIndicator = {
      blueprint: 'latency',
      threshold: 0.9,
      aggregation: 'SUM',
      type: 'eventBased'
    };

    const entity: SyntheticSloEntity = {
      type: 'synthetic',
      syntheticTestIds: ['testId1', 'testId2'],
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: []
      }
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      name: 'synthetic.metricsResponseTime',
      operator: LESS_OR_EQUAL_THAN,
      value: indicator.threshold,
      entity: 'NOT_APPLICABLE',
      type: 'TAG_FILTER'
    });
    expect(bad).toEqual({
      name: 'synthetic.metricsResponseTime',
      operator: GREATER_THAN,
      value: indicator.threshold,
      entity: 'NOT_APPLICABLE',
      type: 'TAG_FILTER'
    });
  });

  it('returns good and bad events filter for an event-based availability synthetic SLO ', () => {
    // Given
    const indicator: AvailabilityBlueprintIndicator = {
      type: 'eventBased',
      threshold: 0.5,
      blueprint: 'availability'
    };

    const entity: SyntheticSloEntity = {
      type: 'synthetic',
      syntheticTestIds: ['testId1', 'testId2'],
      tagFilterExpression: {
        type: 'EXPRESSION',
        logicalOperator: 'AND',
        elements: []
      }
    };

    // When
    const { good, bad } = createGoodBadTagFilterExpression({ indicator, entity });

    // Then
    expect(good).toEqual({
      value: 1,
      name: statusTagName,
      operator: EQUALS,
      entity: 'NOT_APPLICABLE',
      type: 'TAG_FILTER'
    });
    expect(bad).toEqual({
      value: 0,
      name: statusTagName,
      operator: EQUALS,
      entity: 'NOT_APPLICABLE',
      type: 'TAG_FILTER'
    });
  });
});
