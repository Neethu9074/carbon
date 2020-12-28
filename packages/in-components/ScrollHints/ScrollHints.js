import React, { Fragment } from 'react';
import classNames from 'classnames';

import { combineLatest, on } from '@instana/observables';
import { debouncedResize$ } from 'in-services/browser';

import locals from './ScrollHints.mless';

// Hide the scroll indicator shortly before the scroll bar reaches the end of its range.
const FUZZINESS = 5;

/**
 * This component checks if a potential scrollable element can be scrolled up or down and passes this information to
 * its child element.
 *
 * It is similar to packages/in-components/layout/HeightRestrictedView, but a more general. For example, HeightRestrictedView
 * makes assumptions about the timeline footer being present. Also, HeightRestrictedView only considers a scrolling hint
 * at the bottom while this component renders hints at the bottom or top (or both) depending in which direction
 * scrolling is possible.
 */
export default class ScrollHints extends React.Component {
  static displayName = 'ScrollHints';

  constructor(props) {
    super(props);
    this.state = {
      canScrollUp: false,
      canScrollDown: false
    };
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.containerDomNode = this.containerRef.current;
    const debouncedScroll$ = on(this.containerDomNode, 'scroll').debounce(50);
    this.calculate();
    this.subscription = combineLatest([debouncedResize$, debouncedScroll$], false).subscribe(this.calculate);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // force a recalculation if the content (and thus its height) changes.
    if (nextProps.contentChangeMarker !== this.state.contentChangeMarker) {
      setTimeout(this.calculate, 0);
    }
  }

  calculate = () => {
    const newState = {
      canScrollUp: false,
      canScrollDown: false
    };

    newState.canScrollUp = this.containerDomNode.scrollTop > FUZZINESS;
    newState.canScrollDown =
      this.containerDomNode.offsetHeight + this.containerDomNode.scrollTop + FUZZINESS <
      this.containerDomNode.scrollHeight;
    const stateChanged =
      newState.canScrollUp !== this.state.canScrollUp || newState.canScrollDown !== this.state.canScrollDown;

    if (stateChanged) {
      this.setState(newState);
    }
  };

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }
  }

  render() {
    return (
      <Fragment>
        <div
          className={classNames({
            [locals.scrollHintOuter]: true,
            [locals.visible]: this.state.canScrollUp
          })}
        >
          <div className={locals.scrollHintInnerTop} />
        </div>
        <div ref={this.containerRef} className={this.props.className} style={this.props.style}>
          {this.props.children}
        </div>
        <div
          className={classNames({
            [locals.scrollHintOuter]: true,
            [locals.visible]: this.state.canScrollDown
          })}
        >
          <div className={locals.scrollHintInnerBottom} />
        </div>
      </Fragment>
    );
  }
}
