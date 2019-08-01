import React, { Fragment } from 'react';

import SelectableItem from 'in-new-components/time/TimeSelectionDialogPresenter/SelectableItem';
import { getFixedTimePresets, getLivePresets } from 'in-new-components/time/timePresets';
import TimePresetsForReleases from 'in-new-components/time/TimePresetsForReleases';
import Header from 'in-new-components/time/TimeSelectionDialogPresenter/Header';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import locals from './Presets.mless';

export default function Presets({ timeConfig, onChange }) {
  return (
    <div className={locals.wrapper}>
      <Header>Presets</Header>
      <div className={locals.container}>
        <div className={locals.left}>
          {getLivePresets().map((preset, i) => (
            <SelectableItem timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} key={i} />
          ))}
        </div>
        <div className={locals.right}>
          {getFixedTimePresets().map((preset, i) => (
            <SelectableItem timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} key={i} />
          ))}
          <ReleasesPresets onChange={onChange} timeConfig={timeConfig} />
        </div>
      </div>
    </div>
  );
}

function ReleasesPresets({ onChange, timeConfig }) {
  return (
    <Fragment>
      <h1 className={locals.header}>Go to a Release</h1>
      <TimePresetsForReleases onChange={onChange} timeConfig={timeConfig} pageSize={2} />
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
        iconHeight={18}
      >
        Search for a release
      </Button>
    </Fragment>
  );
}
