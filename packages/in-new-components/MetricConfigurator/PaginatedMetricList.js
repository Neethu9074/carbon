/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { Ul, Li } from '@instana/components';

import { nodeArray as nodeArrayPropType } from 'in-new-components/SelectorOverlay/props';
import { search } from 'in-new-components/SelectorOverlay/search';
import Pagination from 'in-new-components/Pagination/Pagination';
import { getInteractiveElements } from 'in-services/util/dom';
import SearchInput from 'in-new-components/SearchInput';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './PaginatedMetricList.mless';

const initialState = {
  query: '',
  currentPage: 1
};

const itemsPerPage = 100;

export default function PaginatedMetricList({ options, onChange, isMetricDisabled }) {
  const [{ query, currentPage }, setState] = useState(initialState);
  options = useMemo(() => {
    if (isNotBlank(query)) {
      return search(options, query);
    }
    return options;
  }, [options, query]);

  // Used to jump to the first available group when clicking enter in the input field.
  const staticContentWrapperRef = useRef();

  return (
    <>
      <div className={locals.searchInputWrapper}>
        <SearchInput
          placeholder={t('in-new-components:metricConfigurator.search')}
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
          {options.slice(currentPage * itemsPerPage - 100, currentPage * itemsPerPage).map(metric =>
            isMetricDisabled(metric.metric) ? (
              <Li key={metric.metric} className={locals.disabled}>
                {metric.label} <br />
                {t('in-new-components:metricConfigurator.labelAlreadySelected')}
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
      </div>
    </>
  );
}

PaginatedMetricList.propTypes = {
  options: nodeArrayPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  isMetricDisabled: PropTypes.func.isRequired
};
