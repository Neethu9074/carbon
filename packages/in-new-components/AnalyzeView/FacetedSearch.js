/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import locals from './FacetedSearch.mless';

export default function FacetedSearch({
  facetedSearchItems = [],
  formModel,
  onFacetedSearchChange,
  getUpdatedTagExpressionHref,
  dataSource,
  isValid,
  getSuggestions
}) {
  return (
    <div className={locals.wrapper}>
      {facetedSearchItems.map(facetedSearchItem => {
        const FilterComponent = facetedSearchItem.renderer;
        return (
          <FilterComponent
            key={facetedSearchItem.tag}
            title={facetedSearchItem.title}
            tag={facetedSearchItem.tag}
            entity={facetedSearchItem.entity}
            formModel={formModel}
            updateFilter={onFacetedSearchChange}
            getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
            isValid={isValid}
            openByDefault={facetedSearchItem.openByDefault}
            dataSource={dataSource}
            getSuggestions={getSuggestions}
            {...facetedSearchItem.extraProps}
          />
        );
      })}
    </div>
  );
}
