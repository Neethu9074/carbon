import Infinite from 'react-infinite';
import React from 'react';

import {loadMoreLines, isLoading$, lines$, enable, disable, refresh} from 'in-views/logView/stores/lines';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import LifecycleObserver from 'in-components/LifecycleObserver';
import getElementDimensions from 'in-hoc/getElementDimensions';
import LoadingIndicator from 'in-components/LoadingIndicator';
import LogLine from 'in-views/logView/LogLine';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './LogLines.less';

const block = 'in-log-lines';

export default connectTo({
  lines: lines$,
  isInfiniteLoading: isLoading$
}, getElementDimensions(function LogLines({lines, height, isInfiniteLoading}) {

  return (
    <FullscreenOverlayView className={block}>
      <LifecycleObserver onWillMount={enable}
                         onWillUnmount={disable} />

      <Button kind='secondary'
              size='sm'
              className={`${block}__refresh`}
              onClick={refresh}>
        <SvgIcon type='refresh'
                 className={`${block}__refresh-icon`}
                 width={16} />
      </Button>

      {height ?
        <Infinite containerHeight={height - 20}
                  elementHeight={15}
                  loadingSpinnerDelegate={<LoadingIndicator type='light' />}
                  infiniteLoadBeginEdgeOffset={height * 0.5}
                  onInfiniteLoad={loadMoreLines}
                  isInfiniteLoading={isInfiniteLoading}
                  className={`${block}__scroller`}>
          {lines.map((line, i) =>
            <LogLine line={line}
                     key={i} />
          )}
        </Infinite>
      : null}
    </FullscreenOverlayView>
  );
}));
