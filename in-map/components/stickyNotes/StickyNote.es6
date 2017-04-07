import { combineLatest } from 'reactive-observables';
import React from 'react';

import { applyTransform } from 'in-services/util/dom';

const rpt = React.PropTypes;
const DEFAULT_STYLE = {
  position: 'absolute',
  zIndex: 0,
  left: 0,
  top: 0
};

export default function StickyNote(ComposedComponent) {
  return React.createClass({
    displayName: 'StickyNote',

    propTypes: {
      eventEmitter: rpt.object.isRequired,
      id: rpt.string.isRequired
    },

    getInitialState() {
      return {
        isVisible: false
      };
    },

    componentDidMount() {
      this.setupSubscriptions();
    },

    componentDidUpdate(prevProps) {
      if (this.props.id !== prevProps.id || this.props.eventEmitter !== prevProps.eventEmitter) {
        this.setupSubscriptions();
      }
    },

    componentWillUnmount() {
      this.disposeSubscriptions();
    },

    render() {
      const content = this.state.isVisible ? <ComposedComponent {...this.props} wrapper={this.stickyNote} /> : null;

      return (
        <div ref={stickyNote => this.stickyNote = stickyNote} style={DEFAULT_STYLE}>
          {content}
        </div>
      );
    },

    setupSubscriptions(props = this.props) {
      this.disposeSubscriptions();

      this.tempSub = combineLatest([
        props.eventEmitter.on('screenPositionChanged' + props.id),
        props.eventEmitter.on('isVisibleChanged' + props.id).distinct()
      ]).subscribe(([_position, _isVisible]) => {
        if (_isVisible) {
          applyTransform(this.stickyNote, `translate3d(${_position.x}px,${_position.y}px,0)`);
        }
        if (_isVisible !== this.state.isVisible) {
          this.setState({ isVisible: _isVisible });
        }
      });
    },

    disposeSubscriptions() {
      if (this.tempSub) {
        this.tempSub.dispose();
        this.tempSub = null;
      }
    }
  });
}
