import { fromJS } from 'immutable';
import { get } from 'lodash';
import React from 'react';

import getKubernetesHostByNode from 'in-subscription/kubernetes/getKubernetesHostByNode';
import { Td, Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import Skeleton from 'in-new-components/Loading/Skeleton';
import EntityLink from 'in-new-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './Infrastructure.mless';

export default connectTo(
  ({ nodeId, timeConfig }) => ({
    hostResult: getKubernetesHostByNode({ nodeId, timeConfig }).map(hostResult => {
      if (!hostResult || !hostResult.data) {
        return hostResult;
      }
      return {
        ...hostResult,
        data: fromJS(hostResult.data)
      };
    })
  }),
  function Infrastructure({ hostResult, timeConfig }) {
    const isLoading = hostResult && get(hostResult, ['progress', 'loading']);
    const hasErrors = hostResult && hostResult.errors.length > 0;
    let content;
    if (isLoading) {
      content = <Skeleton className={locals.skeleton} />;
    } else if (hasErrors) {
      content = 'No host information available. Maybe the host is not monitored by Instana.';
    } else {
      content = (
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

    return (
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{content}</Td>
          </Tr>
        </Tbody>
      </Table>
    );
  }
);
