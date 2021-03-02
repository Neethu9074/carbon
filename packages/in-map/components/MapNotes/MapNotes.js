/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createViewStructureObservable from 'in-subscription/view';
import { alwaysTrue } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import { types, view$ } from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './MapNotes.less';

const block = 'in-map-notes';

export default connectTo(
  {
    hasLogicalViewData: view$
      .flatMap(view => {
        if (view !== types.logical) {
          return alwaysTrue;
        }

        return timeConfig$
          .flatMap(timeConfig => createViewStructureObservable({ timeConfig, viewType: types.logical }))
          .map(viewStructure => viewStructure.children.length > 0);
      })
      .distinct()
  },
  function MapNotes({ hasLogicalViewData }) {
    if (hasLogicalViewData === false) {
      return <div className={block}>{t('in-map:noLogicalViewData')}</div>;
    }

    return null;
  }
);
