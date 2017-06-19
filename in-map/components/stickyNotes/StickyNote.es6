import { combineLatest } from 'reactive-observables';
import rpt from 'prop-types';
import React from 'react';

import { applyTransform } from 'in-services/util/dom';

import 'in-map/components/stickyNotes/StickyNote.less';

const block = 'in-sticky-node';
const invisibleClass = `${block}__invisible`;

export default function StickyNote(ComposedComponent) {
  return class extends React.Component {
    static displayName = `StickyNote for ${ComposedComponent.displayName || ComposedComponent.name}`;

    static propTypes = {
      eventEmitter: rpt.object.isRequired,
      showSticky$: rpt.object.isRequired,
      id: rpt.string.isRequired
    };

    state = {
      isVisible: false
    };

    componentDidMount() {
      this.setupSubscriptions();
    }

    componentDidUpdate(prevProps) {
      if (this.props.id !== prevProps.id || this.props.eventEmitter !== prevProps.eventEmitter) {
        this.setupSubscriptions();
      }
    }

    componentWillUnmount() {
      this.disposeSubscriptions();
    }

    render() {
      if (!this.state.isVisible) {
        return <div className={invisibleClass} ref={stickyNote => (this.stickyNote = stickyNote)} />;
      }

      return (
        <div className={block} ref={stickyNote => (this.stickyNote = stickyNote)}>
          <ComposedComponent {...this.props} wrapper={this.stickyNote} />
        </div>
      );
    }

    setupSubscriptions = (props = this.props) => {
      this.disposeSubscriptions();

      const isVisibleChangedCallback = ([_position, _isVisible, _showSticky]) => {
        const isVisible = _showSticky && _isVisible;
        if (isVisible) {
          applyTransform(this.stickyNote, `translate3d(${_position.x}px,${_position.y}px,0)`);
        }
        if (isVisible !== this.state.isVisible) {
          this.setState({ isVisible });
        }
      };

      this.positionSubscription = combineLatest([
        props.eventEmitter.on('screenPositionChanged' + props.id),
        props.eventEmitter.on('isVisibleChanged' + props.id).distinct(),
        props.showSticky$.distinct()
      ]).subscribe(isVisibleChangedCallback);
    };

    disposeSubscriptions = () => {
      if (this.positionSubscription) {
        this.positionSubscription.dispose();
        this.positionSubscription = null;
      }
    };
  };
}
