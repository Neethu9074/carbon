/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { showAggregations$, toggle } from 'in-stores/metric/showAggregations';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    showAggregations: showAggregations$
  },
  function ShowAggregates({ showAggregations }) {
    return (
      <Control
        onClick={toggle}
        tooltipText={showAggregations ? t('in-map:disableAggregations') : t('in-map:enableAggregations')}
        type="lib_datetime_timerange"
        isActive={showAggregations}
      />
    );
  }
);
