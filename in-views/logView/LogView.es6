import Infinite from 'react-infinite';
import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import logLines from 'in-views/logView/log.json';
import LogLine from 'in-views/logView/LogLine';

import './LogView.less';

const block = 'in-log-view';

export default getElementDimensions(function LogView({height}) {
  return (
    <FullscreenOverlayView className={block}>
      {height ?
        <Infinite containerHeight={height}
                  elementHeight={15}
                  loadingSpinnerDelegate={<LoadingIndicator type='light' />}
                  infiniteLoadBeginEdgeOffset={height * 0.5}
                  displayBottomUpwards
                  className={`${block}__scroller`}>
          {logLines.map((logLine, i) =>
            <LogLine line={logLine}
                     key={i} />
          )}
        </Infinite>
      : null}
    </FullscreenOverlayView>
  );
});


// onInfiniteLoad={loadMoreTraces}
// isInfiniteLoading={this.props.isInfiniteLoading}
