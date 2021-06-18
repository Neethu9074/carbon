/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-find-dom-node */

import classNames from 'classnames';
import ReactDOM from 'react-dom';
import React from 'react';

import { debouncedResize$, debouncedScroll$ } from 'in-services/browser';

/**
 * A higher order component to automatically flip the menu direction of a ComboBox (that is, a Select from react-select)
 * according to the surrounding vertical space. If there is not enough space below the drop down box, the menu will
 * expand upwards instead of down.
 */
export default function autoMenuDirection(ComposedComponent, assumedTimeLineFooterHeight = 97) {
  // https://github.com/JedWatson/react-select/blob/master/less/select.less defines select-menu-max-height: 200px;
  // Of course, the menu can be less high in case it only contains a small number of options, in this case we might
  // unnecessarily flip the menu direction
  const assumedMaxMenuHeight = 200;

  return class extends React.Component {
    static displayName = 'AutoMenuDirection';

    state = {
      direction: 'bottom'
    };

    componentDidMount() {
      this.domNode = ReactDOM.findDOMNode(this);
      this.recalculate();
      this.subscription = debouncedScroll$.merge(debouncedResize$).subscribe(this.recalculate);
    }

    recalculate = () => {
      const boundingRect = this.domNode.getBoundingClientRect();
      const spaceAbove = boundingRect.top;
      const spaceBelow = window.innerHeight - boundingRect.bottom - assumedTimeLineFooterHeight;
      let direction = 'bottom';
      if (spaceBelow < assumedMaxMenuHeight && spaceAbove > spaceBelow) {
        direction = 'top';
      }
      this.setState({ direction: direction });
    };

    componentWillUnmount() {
      this.subscription.dispose();
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          className={classNames(this.props.className, `menu-direction-${this.state.direction}`)}
          menuPlacement={this.state.direction}
        />
      );
    }
  };
}
