import React from 'react';

import SelectableItem from 'in-new-components/time/TimeSelectionDialogPresenter/SelectableItem';
import { getFixedTimePresets, getLivePresets } from 'in-new-components/time/timePresets';
import TimePresetsForReleases from 'in-new-components/time/TimePresetsForReleases';
import Header from 'in-new-components/time/TimeSelectionDialogPresenter/Header';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { Col, Row } from 'in-new-components/layout/Grid';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import locals from './Presets.mless';

export default function Presets({ timeConfig, onChange }) {
  return (
    <div className={locals.wrapper}>
      <Header>Presets</Header>
      <Row>
        <Col lg={6} className={locals.col}>
          {getLivePresets().map((preset, i) => (
            <SelectableItem key={i} timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} />
          ))}
        </Col>
        <Col lg={6} className={locals.col}>
          {getFixedTimePresets().map((preset, i) => (
            <SelectableItem key={i} timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} />
          ))}
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
        </Col>
      </Row>
    </div>
  );
}
