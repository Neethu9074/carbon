/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Ul, Li, SearchInput, Pagination as CarbonPagination } from '@instana/components';

import { carbonPaginationEnabled } from 'in-services/featureFlags';
import { useSearch } from 'in-components/SelectorOverlay/search';
import { getInteractiveElements } from 'in-services/util/dom';
import Pagination from 'in-components/Pagination/Pagination';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './PaginatedMetricList.mless';

const initialState = {
  query: '',
  currentPage: 1
};

const itemsPerPage = 100;

export default function PaginatedMetricList({ options, onChange, isMetricDisabled }) {
  const [{ query, currentPage }, setState] = useState(initialState);
  const filteredOptions = useSearch(options, query);
  const resultingOptions = isBlank(query) ? options : filteredOptions;
  const numPages = Math.ceil(options.length / itemsPerPage);
  // Used to jump to the first available group when clicking enter in the input field.
  const staticContentWrapperRef = useRef();
  return (
    <>
      <div className={locals.searchInputWrapper}>
        <SearchInput
          placeholder={t('in-components:metricConfigurator.search')}
          onChange={_query => {
            setState({
              currentPage,
              query: _query
            });
          }}
          query={query}
          autoFocus
          className={locals.searchInput}
          onReturn={() => {
            const groups = getInteractiveElements(staticContentWrapperRef.current);
            groups[0]?.focus();
            if (groups.length === 1) {
              groups[0].click();
            }
          }}
        />
      </div>
      <div className={locals.overlay}>
        <Ul>
          {resultingOptions.slice(currentPage * itemsPerPage - 100, currentPage * itemsPerPage).map(metric =>
            isMetricDisabled(metric.metric) ? (
              <Li key={metric.metric} className={locals.disabled}>
                {metric.label} <br />
                {t('in-components:metricConfigurator.labelAlreadySelected')}
              </Li>
            ) : (
              <Li
                key={metric.metric}
                className={locals.option}
                onClick={() => {
                  if (!isMetricDisabled(metric.metric)) {
                    setState({
                      currentPage,
                      query: ''
                    });
                    onChange(metric);
                  }
                }}
              >
                <span className={locals.label}>{metric.label}</span>
              </Li>
            )
          )}
        </Ul>
        {numPages > 1 && carbonPaginationEnabled ? (
          <CarbonPagination
            className={locals.paginationSmallWidth}
            currentPage={currentPage}
            totalItems={options.length}
            pageSize={itemsPerPage}
            pageSizes={[itemsPerPage]}
            onChange={data => {
              const newPage = data.page;
              setState({
                currentPage: newPage,
                query
              });
            }}
          />
        ) : (
          <Pagination
            currentPage={currentPage}
            numPages={Math.ceil(options.length / itemsPerPage)}
            onChange={newPage => {
              setState({
                currentPage: newPage,
                query
              });
            }}
          />
        )}
      </div>
    </>
  );
}

PaginatedMetricList.propTypes = {
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isMetricDisabled: PropTypes.func.isRequired
};
