/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { QueryBuilderStateHelper } from 'in-components/QueryBuilder/stories/QueryBuilderStateHelper';
import tagCatalogExampleJson from 'in-components/QueryBuilder/stories/tagCatalogExample';
import QueryBuilder from 'in-components/QueryBuilder/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';
import { createQueryBuilder } from 'in-components/QueryBuilder';

const DefaultExampleQueryBuilder = createQueryBuilder({
  getTagCatalog: successObservableFactory(tagCatalogExampleJson),
  getSuggestions: successObservableFactory({
    suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
    totalHits: 42
  })
}).QueryBuilder;

function DefaultExample() {
  return (
    <QueryBuilderStateHelper>
      {({ value, setState, readOnly }) => (
        <DefaultExampleQueryBuilder value={value} onChange={setState} readOnly={readOnly} />
      )}
    </QueryBuilderStateHelper>
  );
}

export default {
  component: QueryBuilder
};

export const Default = {
  render: () => <DefaultExample />,
  name: 'default'
};
