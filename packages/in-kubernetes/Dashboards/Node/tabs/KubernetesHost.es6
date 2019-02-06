import { fromJS } from 'immutable';
import { get } from 'lodash';
import React from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getKubernetesHost from 'in-subscription/kubernetes/getKubernetesHost';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './KubernetesHost.mless';

export default connectTo(
  ({ nodeId, timeConfig }) => ({
    hostResult: getKubernetesHost({ nodeId, timeConfig }).map(hostResult => {
      if (!hostResult || !hostResult.data) {
        return hostResult;
      }
      return {
        ...hostResult,
        data: fromJS(hostResult.data)
      };
    })
  }),
  function KubernetesHost({ hostResult, timeConfig }) {
    if (!hostResult || get(hostResult, ['progress', 'loading'])) {
      return <Skeleton className={locals.skeleton} />;
    }

    if (!hostResult.data) {
      return 'No host information available';
    }

    return (
      <EntityLink
        snapshot={hostResult.data}
        label={getLabel(hostResult.data)}
        href$={getDashboardLink(hostResult.data.get('id'), {
          pathname: '/physical/dashboard',
          to: timeConfig.to,
          focusedMoment: timeConfig.to
        })}
      />
    );
  }
);
