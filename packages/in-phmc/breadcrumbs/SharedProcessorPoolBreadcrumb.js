/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getSharedProcessorPool from 'in-phmc/subscriptions/getSharedProcessorPool';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    spp: getSharedProcessorPool({
      filter: {
        sharedProcessorPoolId: props.sharedProcessorPoolId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SharedProcessorPoolBreadcrumb({ spp }) {
    return <Breadcrumb label={t('in-phmc:breadcrumbs.sharedProcessorPool')}>{spp && spp.label}</Breadcrumb>;
  }
);
