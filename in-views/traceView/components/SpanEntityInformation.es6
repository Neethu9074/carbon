import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {always} from 'in-services/fixedStreams';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {getSingular} from 'in-sdk/pluginName';

import './SpanEntityInformation.less';

export const loadingPlaceholder = {};
export const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

const block = 'in-trace-view-span-entity-information';

export default function SpanEntityInformation({label, snapshot}) {
  if (snapshot === loadingPlaceholder) {
    return (
      <LoadingIndicator inline
                        type='dark'
                        style={{
                          height: '16px'
                        }} />
    );
  } else if (!snapshot) {
    return null;
  }

  const readablePluginId = getSingular(snapshot.get('plugin'));
  return (
    <span className={block}>
      <span className={`${block}__label`}>
        {label}
      </span>
      &nbsp;
      <img src={getIcon(snapshot)}
           alt={`Icon depicting ${readablePluginId}`}
           className={`${block}__icon`} />
      &nbsp;
      <DashboardLink snapshotId={snapshot.get('id')}
                     className={`${block}__link`}>
        {getLabel(snapshot)}
      </DashboardLink>
    </span>
  );
}
