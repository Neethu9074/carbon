/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getLpar from 'in-phmc/subscriptions/getLpar';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    lpar: getLpar({
      filter: {
        lparId: props.lparId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function LparBreadcrumb({ lpar }) {
    return <Breadcrumb label={t('in-phmc:breadcrumbs.logicalPartitions')}>{lpar && lpar.label}</Breadcrumb>;
  }
);
