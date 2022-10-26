/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getVIOS from 'in-phmc/subscriptions/getVios';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    vios: getVIOS({
      filter: {
        viosId: props.viosId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function ViosBreadcrumb({ vios }) {
    return <Breadcrumb label={t('in-phmc:breadcrumbs.vios')}>{vios && vios.label}</Breadcrumb>;
  }
);
