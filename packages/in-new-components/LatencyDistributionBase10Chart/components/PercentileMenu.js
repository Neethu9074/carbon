import React from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { joinClassNames } from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import Button from 'in-new-components/Button';

import locals from './PercentileMenu.mless';

export default function PercentileMenu(props) {
  return (
    <Overlay withoutWrapper content={PercentileMenuContent} props={props}>
      {({ toggle, refSetter }) => (
        <Button refSetter={refSetter} onClick={toggle} kind="secondary" size="compact">
          Percentile view
        </Button>
      )}
    </Overlay>
  );
}
function PercentileMenuContent({ percentilesShown, selectPercentile, selectNoPercentile, selectAllPercentiles }) {
  return (
    <ul className={locals.list}>
      <li key="all" className={locals.item}>
        <CheckboxFancy
          checked={percentilesShown.every(p => p.get('enabled') === true)}
          indeterminate={
            percentilesShown.some(p => p.get('enabled') === true) &&
            percentilesShown.some(p => p.get('enabled') === false)
          }
          onChange={() =>
            percentilesShown.every(p => p.get('enabled') === true) ? selectNoPercentile() : selectAllPercentiles()
          }
          label="All"
        />
      </li>
      {percentilesShown.map((percentileShown, index) => {
        return (
          <li key={index} className={joinClassNames(locals.item, locals.child)}>
            <CheckboxFancy
              checked={percentileShown.get('enabled')}
              onChange={() => selectPercentile(index)}
              label={'p' + percentileShown.get('value')}
            />
          </li>
        );
      })}
    </ul>
  );
}
