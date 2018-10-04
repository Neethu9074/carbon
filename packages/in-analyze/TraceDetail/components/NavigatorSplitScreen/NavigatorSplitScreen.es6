import { compose } from 'recompose';
import React from 'react';

import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './NavigatorSplitScreen.mless';

export default compose(
  connectTo({
    screenWidth: debouncedResize$
      .startWith(true)
      .map(() => window.innerWidth)
      .distinct()
  }),
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['screenWidth'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setExpanded',
    reducer: (prevState, expanded) => ({
      ...prevState,
      expanded
    })
  })
)(NavigatorSplitScreen);

function getInitialState({ screenWidth }) {
  return {
    expanded: screenWidth >= 1680
  };
}

function NavigatorSplitScreen({ navigator, traceDetail, expanded, setExpanded }) {
  const { isTracesDataSource, totalHits } = navigator.props;
  const numTraces = isTracesDataSource ? totalHits : undefined;
  const numCalls = isTracesDataSource ? undefined : totalHits;

  return (
    <div className={locals.navigatorSplitScreen}>
      {expanded && (
        <div className={locals.navigator}>
          <div className={locals.header}>
            <ItemsInGroupsIndicator numTraces={numTraces} numCalls={numCalls} withoutMargin />

            <SvgIcon
              type={expanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
              width={20}
              className={locals.toggle}
              onClick={() => setExpanded(!expanded)}
            />
          </div>

          {navigator}
        </div>
      )}

      {!expanded && (
        <div className={locals.toggleBar}>
          <div className={locals.toggleWrapper}>
            <SvgIcon
              type={expanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
              width={20}
              className={`${locals.toggleInBar} ${locals.toggle}`}
              onClick={() => setExpanded(!expanded)}
            />
          </div>
        </div>
      )}

      <SideEffectOnPropertyChange expanded={expanded} sideEffect={refreshWindowSizeDependingState} />

      <div
        className={evaluateClassNames({
          [locals.traceDetail]: true,
          [locals.useFullWidth]: !expanded
        })}
      >
        {traceDetail}
      </div>
    </div>
  );
}
