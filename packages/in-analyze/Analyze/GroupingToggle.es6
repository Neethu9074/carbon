import React from 'react';

import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Link from 'in-components/Link';

import Toggle from 'in-components/form/Toggle';

import locals from './GroupingToggle.mless';

export default function GroupingToggle({ raw }) {
  // toggle grouped/raw mode
  const routeChangeParams = {
    raw: !raw
  };
  if (raw) {
    // delete traceGroupName when leaving raw mode
    routeChangeParams.traceGroupName = null;
  }
  return (
    <Link href$={getLinkToAnalyze(routeChangeParams)} className={locals.link}>
      <div onClickCapture={preventReactToggleFromHandlingClickEvent} className={locals.wrapper}>
        <label htmlFor="grouped-raw-toggle" className={locals.label}>
          Grouping
        </label>
        <Toggle id="grouped-raw-toggle" defaultChecked={!raw} />
      </div>
    </Link>
  );
}

function preventReactToggleFromHandlingClickEvent(e) {
  e.stopPropagation();
}
