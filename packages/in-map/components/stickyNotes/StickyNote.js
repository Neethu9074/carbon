/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import { applyTransform } from 'in-services/util/dom';

import 'in-map/components/stickyNotes/StickyNote.less';

const block = 'in-sticky-node';
const invisibleClass = `${block}__invisible`;

export default function StickyNote(ComposedComponent) {
  return class extends React.Component {
    static displayName = 'stickyNoteFor';

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
      const { eventEmitter, id, showSticky$ } = props;
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
        eventEmitter.on('screenPositionChanged' + id),
        eventEmitter.on('isVisibleChanged' + id).distinct(),
        showSticky$.distinct()
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
