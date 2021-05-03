/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './ViewDashboardButton.less';

const block = 'in-sidebar-view-dashboard';

export default connectTo(
  props => {
    return {
      href: getDashboardLink(props.snapshotId)
    };
  },
  function ViewDashboardButton({ href }) {
    return (
      <Button href={href} className={block}>
        {t('in-map:openDashboard')}
      </Button>
    );
  }
);
