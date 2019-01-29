import { fromJS } from 'immutable';
import React from 'react';

import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getKubernetesHost from 'in-subscription/kubernetes/getKubernetesHost';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

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
  function({ hostResult, timeConfig }) {
    if (!hostResult || !hostResult.data) {
      return null;
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
