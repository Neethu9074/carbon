/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { uniqBy } from 'lodash';

import TechnologyIndicator from 'in-applications/components/TechnologyIndicator';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import { getLabel } from 'in-applications/technologyRegistry';

import locals from './TechnologyIndicatorList.mless';

export default function TechnologyIndicatorList({ technologies, getHref$, responsive }) {
  const [showTechnologyLabel, setShowTechnologyLabel] = useState(true);
  const { width, ref } = useResizeObserverCustom();

  useEffect(() => {
    if (!width) {
      return;
    }
    const isResponsive = responsive === undefined ? true : responsive;
    const shouldShowTechnologyLabel = !isResponsive || (isResponsive && (!width || width > 144));
    if (showTechnologyLabel !== shouldShowTechnologyLabel) {
      // Width keeps changing on window resizes
      // Update the label visibility status only when the value changes
      setShowTechnologyLabel(shouldShowTechnologyLabel);
    }
    // we only want to set techologyLabel when width or responsive are changing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, responsive]);

  return (
    <ul className={locals.list} ref={ref}>
      {technologies?.length > 0 &&
        uniqBy(technologies, getLabel).map(pluginOrGroupType => (
          <TechnologyIndicator
            getHref$={getHref$}
            key={pluginOrGroupType}
            pluginOrGroupType={pluginOrGroupType}
            showTechnologyLabel={showTechnologyLabel}
          />
        ))}
    </ul>
  );
  // }
}
