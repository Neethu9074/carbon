import React from 'react';

import {applyTransform} from 'in-services/util/dom';


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
      this.positionSubscription = this.props.eventEmitter.on('screenPositionChanged' + this.props.id)
        .subscribe(newPosition =>
          applyTransform(this.refs.stickyNote, `translate3d(${newPosition.x}px,${newPosition.y}px,0)`));

      this.visibilitySubscription = this.props.eventEmitter.on('isVisibleChanged' + this.props.id)
        .distinct()
        .subscribe(isVisible => this.setState({isVisible}));
    },

    componentWillUnmount() {
      this.positionSubscription.dispose();
      this.positionSubscription = null;

      this.visibilitySubscription.dispose();
      this.visibilitySubscription = null;
    },

    shouldComponentUpdate(nextProps, nextState) {
      if (nextState.isVisible === this.state.isVisible &&
          this.props.id === nextProps.id) {
        return false;
      }
      return true;
    },

    render() {
      const content = this.state.isVisible
        ? <ComposedComponent {...this.props}
                             wrapper={this.refs.stickyNote} />
        : null;

      return (
        <div ref='stickyNote'
             style={DEFAULT_STYLE}>
          {content}
        </div>
      );
    }
  });
}
