import rpt from 'prop-types';
import React from 'react';

import { isOpen$, toggleMenu } from 'in-new-components/BetaMarker/BetaMarkerStore';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './BetaMarker.mless';

export default connectTo(
  {
    isOpen: isOpen$
  },
  class BetaMarker extends React.Component {
    static propTypes = {
      isOpen: rpt.bool
    };

    render() {
      if (!this.props.isOpen) {
        this.disposeListener();
      }

      this.registerListener();

      return (
        <div className={locals.wrapper}>
          <div className={locals.betaMarker}>
            <div className={locals.header} onClick={toggleMenu}>
              <h1 className={locals.headerTitle}>Beta Feature</h1>
              <div className={locals.headerIcon}>
                <SvgIcon
                  className={locals.arrowIcon}
                  type={!this.props.isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                  width={16}
                  height={16}
                />
              </div>
            </div>
            {this.props.isOpen && (
              <div className={locals.body}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque in incidunt at architecto a
                  exercitationem aut animi.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    registerListener = () => {
      if (this.registered) {
        return;
      }

      // Delay listener registration. If we would do this synchronously,
      // we would receive the click event which opened this dialog and
      // the dialog would be immediately closed.
      setTimeout(() => {
        window.addEventListener('click', this.onMouseUp, false);
        this.registered = true;
      }, 0);
    };

    disposeListener = () => {
      if (!this.registered) {
        return;
      }
      window.removeEventListener('click', this.onMouseUp, false);
      this.registered = false;
    };
  }
);
