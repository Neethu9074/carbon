import React, { Fragment } from 'react';

import { Table, Tbody, Tr, Td } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { urlQueryKeys } from 'in-stores/time/config';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';

import locals from './EntityVersionListPresenter.mless';

export default function EntityVersionListPresenter({ plugin, snapshotVersions }) {
  const heading = (
    <Fragment>
      <PluginIcon className={locals.icon} plugin={plugin} dimension={48} />
      <h2 className={locals.title}>{`${getSingular(plugin)} not found`}</h2>
    </Fragment>
  );

  if (!snapshotVersions || snapshotVersions.length === 0) {
    return <div className={locals.frame}>{heading}</div>;
  }

  snapshotVersions.sort(sortByTo);

  return (
    <div className={locals.frame}>
      {heading}
      <p className={locals.explanation}>
        We could not find a version of this pod in the selected time range. We found other versions in different time
        ranges:
      </p>
      <Table className={locals.table}>
        <Tbody>
          {snapshotVersions.map(({ from, to }, i) => (
            <Tr
              key={i}
              className={locals.row}
              size="compact"
              onClick={() =>
                mutateUrl(location => {
                  const windowSize = (to || Date.now()) - from;
                  location.query[urlQueryKeys.autoRefresh] = 'false';
                  location.query[urlQueryKeys.to] = to || '';
                  location.query[urlQueryKeys.windowSize] = windowSize;
                  location.query[urlQueryKeys.focusedMoment] = to ? to - windowSize / 2 : '';
                })
              }
            >
              <Td className={locals.fromTimestamp}>{formatDateTime(from)}</Td>

              <Td className={locals.toSpan}>to</Td>
              <Td className={locals.toTimestamp}>{to ? formatDateTime(to) : 'Now'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

function sortByTo(versionA, versionB) {
  if (!versionA.to) {
    return -Number.MAX_VALUE;
  }
  if (!versionB.to) {
    return Number.MAX_VALUE;
  }

  return versionB.to - versionA.to;
}
