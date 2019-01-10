import { compose, withState } from 'recompose';
import React from 'react';

import BackendTraceButton from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendTraceButton';
import HeaderToggleIcon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import TypeHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/TypeHeader';
import renderers from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers';
import { HighlightedEffect } from 'in-new-components/SelectedElementHighlighter';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Beacon.mless';

export default compose(withState('expanded', 'setExpanded', false))(function Beacon(props) {
  const { beacon, expanded, setExpanded } = props;

  const beaconRenderers = renderers[beacon.type];
  if (!beaconRenderers) {
    return <div>Unsupported beacon type: {beacon.type}</div>;
  }

  return (
    <HighlightedEffect id={getHighlighterId(beacon.beaconId)}>
      {({ highlighted, refSetter }) => (
        <div
          ref={refSetter}
          className={evaluateClassNames({
            [locals.beacon]: true,
            [locals.erroneous]: beacon.errorCount > 0,
            [locals.highlighted]: highlighted
          })}
        >
          <div className={locals.header}>
            <div className={locals.leftHeader}>
              <TypeHeader beacon={beacon} />
              <beaconRenderers.LeftHeader {...props} toggleExpanded={() => setExpanded(!expanded)} />
            </div>
            <div className={locals.rightHeader}>
              <BackendTraceButton beacon={beacon} />
              <HeaderToggleIcon {...props} />
            </div>
          </div>

          {expanded && (
            <div className={locals.body}>
              <beaconRenderers.Body {...props} />
            </div>
          )}
        </div>
      )}
    </HighlightedEffect>
  );
});

export function getHighlighterId(beaconId) {
  return `page-load-view-beacon-${beaconId}`;
}
