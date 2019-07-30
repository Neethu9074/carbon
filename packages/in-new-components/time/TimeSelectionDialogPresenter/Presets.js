import React from 'react';

import SelectableItem from 'in-new-components/time/TimeSelectionDialogPresenter/SelectableItem';
import { getFixedTimePresets, getLivePresets } from 'in-new-components/time/timePresets';
import Header from 'in-new-components/time/TimeSelectionDialogPresenter/Header';
import { setActiveDialog } from '../../../in-components/DialogPresenter/store';
import TimePresetsForReleases from '../TimePresetsForReleases';
import { Col, Row } from 'in-new-components/layout/Grid';
import locals from './Presets.mless';
import Button from '../../Button';
import Dialog from '../../Dialog';

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
                <Dialog headless title="Search for a release" onClose={() => setActiveDialog(null)}>
                  <div>
                    <TimePresetsForReleases onChange={onChange} timeConfig={timeConfig} pageSize={3} />
                  </div>
                </Dialog>
              )
            }
            icon="lib_actions_search"
          >
            Search for a release
          </Button>
        </Col>
      </Row>
    </div>
  );
}
