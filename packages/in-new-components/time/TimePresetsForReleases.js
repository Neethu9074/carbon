import React from 'react';

import ServerTablePresenter from '../../in-components/tables/ServerTable/ServerTablePresenter';
import SelectableItem from './TimeSelectionDialogPresenter/SelectableItem';
import { setActiveDialog } from '../../in-components/DialogPresenter/store';
import { setTimeConfig, timeConfig$ } from 'in-stores/time/config';
import { getModifiedUrlStream } from '../../in-stores/navigation';
import WithEmptyStateFallback from '../WithEmptyStateFallback';
import { formatDateTime } from 'in-services/formatters/date';
import NoDataAvailable from '../Errors/NoDataAvailable';
import { pendingResult } from 'in-services/fixedObjects';
import getReleases from 'in-subscription/getReleases';
import connectTo from '../../in-hoc/connectTo';
import { timeout } from 'reactive-observables';
import Link from '../../in-components/Link';

function getColumnDefinitions({ windowSize }) {
  return [
    {
      id: 'name',
      label: 'Release',
      getContent(entity) {
        return (
          <Link
            onClick={() => setActiveDialog(null)}
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
  const timeConfig = props.timeConfig;
  const pageSize = props.pageSize;
  return {
    result: timeout(800)
      .flatMap(() => getReleasesSubscribeEvent({ pageSize, timeConfig }))
      .startWith(pendingResult)
  };
})(TimePresetsForReleases);
function TimePresetsForReleases({ timeConfig, onChange, result, pageSize }) {
  const columnDefinitions = getColumnDefinitions(timeConfig);

  if (pageSize === 2 && result.data && result.data.totalHits > 0) {
    return getReleasesPresets(result, timeConfig, onChange);
  } else if (pageSize === 3) {
    return (
      <WithEmptyStateFallback
        center={false}
        getHasDataToRender={getHasDataToRender}
        FallbackComponent={() => (
          <ServerTablePresenter
            columnDefinitions={columnDefinitions}
            pageSize={3}
            query=""
            page={1}
            result={{ errors: [], progress: { loading: false }, data: { items: [] } }}
            renderNoDataAvailable={() => NoDataAvailable}
          />
        )}
      >
        <ServerTablePresenter
          onChange={onChange}
          result={result}
          timeConfig={timeConfig}
          columnDefinitions={columnDefinitions}
          noDataMessage="No releases found"
          orderBy="start"
          orderDirection="DESC"
          pageSize={3}
          query=""
          page={1}
          searchPlaceholder="Filter..."
          cardTitle="Releases"
        />
      </WithEmptyStateFallback>
    );
  } else {
    return null;
  }
}

export function getHasDataToRender() {
  const pageSize = 3;
  return timeConfig$
    .flatMap(timeConfig => getReleasesSubscribeEvent({ pageSize, timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getReleasesSubscribeEvent({
  query = '',
  page = 1,
  pageSize,
  orderBy = 'start',
  orderDirection = 'DESC',
  timeConfig
}) {
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
    timeConfig: timeConfig
  });
}

export function getReleasesPresets(result, timeConfig, onChange) {
  return result.data.items.map(item => getReleaseTimePreset(item, timeConfig, onChange));
}

function getReleaseTimePreset(item, timeConfig, onChange) {
  const label = item.name;
  const to = item.start + timeConfig.windowSize / 2;
  const newTimeConfig = {
    label: label,
    windowSize: timeConfig.windowSize,
    to
  };
  return <SelectableItem key={label} timeConfig={timeConfig} newTimeframe={newTimeConfig} onChange={onChange} />;
}
