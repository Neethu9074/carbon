/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isLoading$ } from 'in-components/graphView/graphViewStore';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './GraphLoadingIndicator.less';

const block = 'in-graph-loading-indicator';

export default connectTo(
  {
    isLoading: isLoading$
  },
  function GraphLoadingIndicator({ isLoading }) {
    if (!isLoading) {
      return null;
    }

    return <div className={block}>{t('forms.states.loading')}</div>;
  }
);
