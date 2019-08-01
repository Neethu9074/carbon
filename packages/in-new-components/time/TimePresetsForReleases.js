import React from 'react';

import SelectableItem from 'in-new-components/time/TimeSelectionDialogPresenter/SelectableItem';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { setTimeConfig, timeConfig$ } from 'in-stores/time/config';
import { close } from 'in-components/DialogPresenter/store';
import { getModifiedUrlStream } from 'in-stores/navigation';
import ServerTable from 'in-components/tables/ServerTable';
import { pendingResult } from 'in-services/fixedObjects';
import getReleases from 'in-subscription/getReleases';
import { timeout } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

function getColumnDefinitions({ windowSize }) {
  return [
    {
      id: 'name',
      label: 'Release',
      getContent(entity) {
        return (
          <Link
            onClick={() => close()}
            href$={getModifiedUrlStream(params => {
              const to = entity.start + windowSize / 2;
              setTimeConfig(params, { to, windowSize });
            })}
          >
            {entity.name}
          </Link>
        );
      },
      getValue(entity) {
        return entity.name;
      }
    },
    {
      id: 'start',
      label: 'Started',
      defaultOrderDirection: 'DESC',
      getContent(entity) {
        return formatDateTime(entity.start);
      }
    }
  ];
}

export default connectTo(props => {
  const pageSize = props.pageSize;

  return {
    result: timeout(800)
      .flatMap(() => getReleasesSubscribeEvent({ pageSize }))
      .startWith(pendingResult)
  };
})(TimePresetsForReleases);
function TimePresetsForReleases({ timeConfig, onChange, result, pageSize }) {
  const columnDefinitions = getColumnDefinitions(timeConfig);

  if (pageSize === 2 && result.data && result.data.totalHits > 0) {
    return getReleasesPresets(result, timeConfig, onChange);
  } else if (pageSize === 5) {
    return (
      <WithEmptyStateFallback
        center={false}
        getHasDataToRender={getHasDataToRender}
        FallbackComponent={() => (
          <ServerTablePresenter
            columnDefinitions={columnDefinitions}
            pageSize={5}
            query=""
            page={1}
            result={{ errors: [], progress: { loading: false }, data: { items: [] } }}
            renderNoDataAvailable={() => NoDataAvailable}
          />
        )}
      >
        <ServerTable
          get={getReleasesSubscribeEvent}
          getResettingProps={() => ['query']}
          defaultPageSize={5}
          columnDefinitions={columnDefinitions}
          paginationResettingProps={{}}
          getRowProps={() => ({ size: 'compact' })}
          noDataMessage="No releases found"
          defaultOrderBy="start"
          defaultOrderDirection="DESC"
          searchPlaceholder="Filter..."
        />
      </WithEmptyStateFallback>
    );
  } else {
    return null;
  }
}

function getHasDataToRender() {
  const pageSize = 5;
  const page = 1;
  return timeConfig$
    .flatMap(timeConfig => getReleasesSubscribeEvent({ page, pageSize, timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getReleasesSubscribeEvent({ query = '', page = 1, pageSize = 5, orderBy = 'start', orderDirection = 'DESC' }) {
  return getReleases({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: query,
    timeConfig: null
  });
}

function getReleasesPresets(result, timeConfig, onChange) {
  return result.data.items.map(item => getReleaseTimePreset(item, timeConfig, onChange));
}

function getReleaseTimePreset(item, timeConfig, onChange) {
  let label = item.name;
  const suffix = fromNowAccurately(item.start);
  label = label + '  (' + suffix + ' ago)';
  const to = item.start + timeConfig.windowSize / 2;

  const newTimeConfig = {
    label: label,
    windowSize: timeConfig.windowSize,
    to
  };
  return <SelectableItem key={item.id} timeConfig={timeConfig} newTimeframe={newTimeConfig} onChange={onChange} />;
}
