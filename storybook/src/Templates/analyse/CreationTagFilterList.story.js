/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';

export default {
  title: 'Templates|application/TagFilterList',
  component: TagFilterList
};

export function Default() {
  const tagFilters = [
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    }
  ];
  return (
    <TagFilterList
      filterConnectionOperators={['OR', 'AND']}
      tagFilters={tagFilters}
      onTagFilterClick={action('onTagFilterClick')}
      onRemoveTagFilter={action('onRemoveTagFilter')}
    />
  );
}

export function TwoAndFilters() {
  const tagFilters = [
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    },
    {
      tag: {
        name: 'endpoint.name',
        entity: 'NOT_APPLICABLE',
        value: 'GET /cart/:id',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    }
  ];
  return (
    <TagFilterList
      filterConnectionOperators={['OR', 'AND']}
      tagFilters={tagFilters}
      onTagFilterClick={action('onTagFilterClick')}
      onRemoveTagFilter={action('onRemoveTagFilter')}
    />
  );
}

export function TwoFiltersOR() {
  const tagFilters = [
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'OR'
      }
    },
    {
      tag: {
        name: 'endpoint.name',
        entity: 'NOT_APPLICABLE',
        value: 'GET /cart/:id',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    }
  ];
  return (
    <TagFilterList
      filterConnectionOperators={['OR', 'AND']}
      tagFilters={tagFilters}
      onTagFilterClick={action('onTagFilterClick')}
      onRemoveTagFilter={action('onRemoveTagFilter')}
    />
  );
}

export function ThreeFilters() {
  const tagFilters = [
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    },
    {
      tag: {
        name: 'endpoint.name',
        entity: 'NOT_APPLICABLE',
        value: 'GET /cart/:id',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'OR'
      }
    },
    {
      tag: {
        name: 'endpoint.name',
        entity: 'NOT_APPLICABLE',
        value: 'GET /cart/:id',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    }
  ];
  return (
    <TagFilterList
      filterConnectionOperators={['OR', 'AND']}
      tagFilters={tagFilters}
      onTagFilterClick={action('onTagFilterClick')}
      onRemoveTagFilter={action('onRemoveTagFilter')}
    />
  );
}

export function OnlyOr() {
  const tagFilters = [
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'OR'
      }
    },
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'OR'
      }
    },
    {
      tag: {
        name: 'service.name',
        entity: 'NOT_APPLICABLE',
        value: 'cart',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    }
  ];
  return (
    <TagFilterList
      filterConnectionOperators={['OR', 'AND']}
      tagFilters={tagFilters}
      onTagFilterClick={action('onTagFilterClick')}
      onRemoveTagFilter={action('onRemoveTagFilter')}
    />
  );
}

export function OnlyAnd() {
  const tagFilters = [
    {
      tag: {
        name: 'service.name',
        entity: 'DESTINATION',
        value: 'api.eu.opsgenie.com',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    },
    {
      tag: {
        name: 'service.name',
        entity: 'DESTINATION',
        value: 'arn:aws:lambda:us-east-2:410797082306:function:demo-cloudwatch-events-processor:$LATEST',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    },
    {
      tag: {
        name: 'service.name',
        entity: 'DESTINATION',
        value: 'appdata-live-aggregator',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    },
    {
      tag: {
        name: 'service.name',
        entity: 'DESTINATION',
        value: 'acceptor',
        operator: 'EQUALS',
        secondLevelName: '',
        conjunction: 'AND'
      }
    },
    {
      tag: {
        name: 'call.http.status',
        entity: 'NOT_APPLICABLE',
        value: '2',
        operator: 'STARTS_WITH',
        secondLevelName: '',
        conjunction: 'AND'
      }
    }
  ];
  return (
    <TagFilterList
      filterConnectionOperators={['OR', 'AND']}
      tagFilters={tagFilters}
      onTagFilterClick={action('onTagFilterClick')}
      onRemoveTagFilter={action('onRemoveTagFilter')}
    />
  );
}
