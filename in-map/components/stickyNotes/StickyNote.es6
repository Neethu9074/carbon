import React from 'react';

import {applyTransform} from 'in-services/util/dom';


const rpt = React.PropTypes;

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
        .subscribe(newPosition => {
          const stickyNote = this.refs.stickyNote;
          if (stickyNote) {
            applyTransform(stickyNote, `translate3d(${newPosition.x}px,${newPosition.y}px,0)`);
          }
        });

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

    render() {
      if (!this.state.isVisible) {
        return null;
      }

      const style = {
        position: 'absolute',
        left: 0,
        top: 0
      };

      return (
        <div ref='stickyNote'
             style={style}>
          <ComposedComponent {...this.props}
                             {...this.state} />
        </div>
      );
    }
  });
}
