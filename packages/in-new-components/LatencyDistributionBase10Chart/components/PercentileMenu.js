/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import { List } from 'immutable';
import { t } from 'in-i18n';
import React from 'react';

import { latencyPercentileMenuClickedTracker } from 'in-analyze/tracker';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';

import locals from './PercentileMenu.mless';

export const ALL_PERCENTILES = List.of(50, 90, 95, 99);

export default function PercentileMenu(props) {
  return (
    <Overlay withoutWrapper content={PercentileMenuContent} props={props}>
      {({ toggle, refSetter }) => {
        const trackAndToggle = () => {
          latencyPercentileMenuClickedTracker();
          toggle();
        };
        return (
          <Button refSetter={refSetter} onClick={trackAndToggle} kind="secondary" size="compact">
            {t('in-new-components:latencyDistributionBase10Chart.percentileMenuButtonPercentileView')}
          </Button>
        );
      }}
    </Overlay>
  );
}
function PercentileMenuContent({ percentilesShown, onChange }) {
  const indeterminateAll = 0 < percentilesShown.count() && percentilesShown.count() < ALL_PERCENTILES.count();
  return (
    <ul className={locals.list}>
      <li key="all" className={locals.item}>
        <CheckboxFancy
          checked={indeterminateAll ? null : percentilesShown.count() === ALL_PERCENTILES.count()}
          indeterminate={indeterminateAll}
          onChange={() =>
            percentilesShown.count() === ALL_PERCENTILES.count() ? onChange(List()) : onChange(ALL_PERCENTILES)
          }
          label={t('in-new-components:latencyDistributionBase10Chart.')}
        />
      </li>
      {ALL_PERCENTILES.map(percentile => {
        return (
          <li key={percentile} className={classNames(locals.item, locals.child)}>
            <CheckboxFancy
              checked={percentilesShown.includes(percentile)}
              onChange={() =>
                percentilesShown.includes(percentile)
                  ? onChange(percentilesShown.filter(p => p !== percentile))
                  : onChange(percentilesShown.push(percentile).sort())
              }
              label={'p' + percentile}
            />
          </li>
        );
      })}
    </ul>
  );
}
