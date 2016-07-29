import React from 'react';


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
        isVisible: false,
        x: 0,
        y: 0
      };
    },

    componentDidMount() {
      this.positionSubscription = this.props.eventEmitter.on('screenPositionChanged' + this.props.id)
        .subscribe(newPosition => {
          this.setState({
            x: newPosition.x,
            y: newPosition.y
          });
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
        top: this.state.y,
        left: this.state.x
      };

      return (
        <div style={style}>
          <ComposedComponent {...this.props}
                             {...this.state} />
        </div>
      );
    }
  });
}
