/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';
import { range } from 'lodash';

import { LoadingSkeleton, Message } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-components/AnalyzeView/FacetedFilters/Placeholders.mless';

export function Loading({ numberOfRows = 5, loadingSkeletonClass }) {
  return range(numberOfRows).map((e, i) => (
    <div key={i} className={locals.suggestion}>
      <div className={locals.addSuggestion}>
        <LoadingSkeleton
          className={classNames(locals.skeletonContainer, {
            [loadingSkeletonClass]: loadingSkeletonClass
          })}
        />
      </div>
    </div>
  ));
}

export function Errors({ errors, setNumberOfPresentedRows }) {
  useEffect(() => {
    setNumberOfPresentedRows(errors.length);
  }, [errors, setNumberOfPresentedRows]);
  return errors.map(error => (
    <Message key={error.code} type="error" small>
      {error.message}
    </Message>
  ));
}

export function NoResults({ className, setNumberOfPresentedRows }) {
  useEffect(() => {
    setNumberOfPresentedRows(1);
  }, [setNumberOfPresentedRows]);
  return (
    <div
      className={classNames(locals.noResults, {
        [className]: className
      })}
    >
      {t('in-components:analyze.noResults')}
    </div>
  );
}
