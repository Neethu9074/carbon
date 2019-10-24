import React from 'react';

import { clearHighlightedTimeframe } from 'in-stores/timeline/highlightedTimeframe';
import { Td, Tr } from 'in-components/tables/sharedComponents';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HighlightedTimeframeMarkerRow.mless';

export default function HighlightedTimeframeMarkerRow({ cols }) {
  return (
    <Tr className={locals.row} size="compact">
      <Td colSpan={cols}>
        <div className={locals.wrapper}>
          <div className={locals.notificatioNWrapper}>
            <SvgIcon className={locals.icon} type="lib_help_error_info_outline" />
            Showing events for selection
          </div>
          <Button size="compact" kind="action" icon="lib_openclose_circle" onClick={clearHighlightedTimeframe}>
            Clear selection
          </Button>
        </div>
      </Td>
    </Tr>
  );
}
