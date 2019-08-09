import React, { Fragment } from 'react';

import TimePresetsForReleases, { getReleasesSubscribeEvent } from 'in-new-components/time/TimePresetsForReleases';
import SelectableItem from 'in-new-components/time/TimeSelectionDialogPresenter/SelectableItem';
import { getFixedTimePresets, getLivePresets } from 'in-new-components/time/timePresets';
import Header from 'in-new-components/time/TimeSelectionDialogPresenter/Header';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { fromNowAccurately } from 'in-services/formatters/date';
import { releasesEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { timeout } from 'reactive-observables';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './Presets.mless';

export default connectTo(props => {
  const releaseTimeConfig = {
    to: Date.now(),
    focusedMoment: Date.now(),
    autoRefresh: props.timeConfig.autoRefresh,
    windowSize: 30 * 24 * 60 * 60 * 1000
  };
  return {
    result: timeout(800)
      .flatMap(() => getReleasesSubscribeEvent({ timeConfig: releaseTimeConfig, page: 1, pageSize: 3 }))
      .startWith(pendingResult)
  };
})(Presets);

function Presets({ timeConfig, onChange, result }) {
  return (
    <div className={locals.wrapper}>
      <Header>Presets</Header>
      <div className={locals.container}>
        <div className={locals.leftColumn}>
          {getLivePresets().map((preset, i) => (
            <SelectableItem timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} key={i} />
          ))}
        </div>
        <div className={locals.rightColumn}>
          {getFixedTimePresets().map((preset, i) => (
            <SelectableItem timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} key={i} />
          ))}
          {releasesEnabled &&
            result.data &&
            result.data.totalHits > 0 && (
              <ReleasesPresets onChange={onChange} timeConfig={timeConfig} result={result} />
            )}
        </div>
      </div>
    </div>
  );
}

function ReleasesPresets({ onChange, timeConfig, result }) {
  return (
    <Fragment>
      <h1 className={locals.header}>Go to a Release</h1>
      {getReleasesPresets(result, timeConfig, onChange)}
      <Button
        className={locals.button}
        kind="secondary"
        onClick={() =>
          setActiveDialog(
            <Dialog className={locals.dialog} title="Search for a release" onClose={() => close()}>
              <TimePresetsForReleases onChange={onChange} timeConfig={timeConfig} pageSize={5} />
            </Dialog>
          )
        }
        icon="lib_actions_search"
      >
        Search for a release
      </Button>
    </Fragment>
  );
}

function getReleasesPresets(result, timeConfig, onChange) {
  return result.data.items.map(item => getReleaseTimePreset(item, timeConfig, onChange));
}

function getReleaseTimePreset(item, timeConfig, onChange) {
  const label = item.name;
  const suffix = fromNowAccurately(item.start) + ' ago';
  const to = item.start + timeConfig.windowSize / 2;

  const newTimeConfig = {
    label: label,
    windowSize: timeConfig.windowSize,
    to
  };

  const selectable = (
    <div className={locals.releases}>
      <SelectableItem timeConfig={timeConfig} newTimeframe={newTimeConfig} onChange={onChange} />
    </div>
  );

  return (
    <Tooltip key={item.id} content={suffix}>
      {selectable}
    </Tooltip>
  );
}
