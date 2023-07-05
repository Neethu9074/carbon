/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  ApplicationSloEntity,
  CustomEventBasedSli,
  EventBasedSli,
  TimeBasedSli,
  WebsiteSloEntity
} from '@instana/types';

import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';

describe('in-service-levels/utils/tagFilter', () => {
  it('returns default TagFilterExpressions for good and bad events when a time-based SLI is provided', () => {
    // Given
    const indicator: TimeBasedSli = {
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
    const indicator: CustomEventBasedSli = {
      blueprint: 'latency',
      threshold: 0.9,
      type: 'customEventBased',
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
    const indicator: CustomEventBasedSli = {
      blueprint: 'latency',
      threshold: 0.9,
      type: 'customEventBased',
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
    const indicator: EventBasedSli = {
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
    const indicator: EventBasedSli = {
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
    const indicator: EventBasedSli = {
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
    const indicator: EventBasedSli = {
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
    const indicator: TimeBasedSli = {
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
});
