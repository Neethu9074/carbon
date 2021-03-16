/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getCloudfoundryApplication from 'in-cloudfoundry/subscriptions/getCloudfoundryApplication';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    application: getCloudfoundryApplication({
      filter: {
        applicationId: props.applicationId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function ApplicationBreadcrumb({ application }) {
    return (
      <Breadcrumb label={t('in-cloudfoundry:breadcrumbs.cloudFoundryApplication')} icon="lib_cloudfoundry_application">
        {application && application.label}
      </Breadcrumb>
    );
  }
);
