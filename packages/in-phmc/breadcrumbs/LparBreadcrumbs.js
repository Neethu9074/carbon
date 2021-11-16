/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getLpars from 'in-phmc/subscriptions/getLpars';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    lpar: getLpars({
      filter: {
        lparId: props.lparId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function LparBreadcrumbs({ lpar }) {
    return <Breadcrumb label={t('in-phmc:breadcrumbs.logicalPartitions')}>{lpar && lpar.label}</Breadcrumb>;
  }
);
