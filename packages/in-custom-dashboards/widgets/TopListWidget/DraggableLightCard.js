import React from 'react';

import { onEnter, onLeave } from 'in-services/util/reactiveMouseEvents';
import { evaluateClassNames } from 'in-services/util/classnames';
import LightCard from 'in-new-components/Card/LightCard';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './DraggableLightCard.mless';

export default class DraggableLightCard extends React.Component {
  static displayName = 'BasicDialog';

  state = {
    isHovering: false
  };

  componentDidMount() {
    this.onEnterHandler = onEnter(this.icon, () => this.setState({ isHovering: true }));
    this.onLeaveHandler = onLeave(this.icon, () => this.setState({ isHovering: false }));
  }

  componentWillUnmount() {
    if (this.onEnterHandler) {
      this.onEnterHandler.dispose();
      this.onEnterHandler = null;
    }
    if (this.onLeaveHandler) {
      this.onLeaveHandler.dispose();
      this.onLeaveHandler = null;
    }
  }

  render() {
    return (
      <LightCard
        {...this.props}
        headerClassName={locals.header}
        className={evaluateClassNames({
          [locals.cardWithStrongShadow]: this.state.isHovering
        })}
        bodyClassName={locals.content}
      >
        <div className={locals.dragHandleIconWrapper} ref={icon => (this.icon = icon)}>
          <SvgIcon className={locals.dragHandleIcon} type="lib_actions_reorder" />
        </div>
        {this.props.children}

        {this.props.fullListViewLinkTitle && this.props.fullListView$ ? (
          <Link className={locals.link} href$={this.props.fullListView$}>
            {this.props.fullListViewLinkTitle}
          </Link>
        ) : (
          <div className={locals.linkPlaceHolder} />
        )}
      </LightCard>
    );
  }
}
