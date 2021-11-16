/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getVIOServers from 'in-phmc/subscriptions/getVIOServers';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    vios: getVIOServers({
      filter: {
        viosId: props.viosId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function ViosBreadcrumbs({ vios }) {
    return <Breadcrumb label={t('in-phmc:breadcrumbs.vios')}>{vios && vios.label}</Breadcrumb>;
  }
);
