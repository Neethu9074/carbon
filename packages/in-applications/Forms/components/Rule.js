import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Toggle from 'in-components/form/Toggle';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Rule.mless';

export default class Rule extends React.Component {
  static displayName = 'Rule';

  constructor(props) {
    super(props);

    this.state = {
      expand: false
    };
  }

  render() {
    const {
      name,
      content,
      expandableContent,
      enabled,
      reorderable,
      isInstanaDefaultRule,
      onToggleEnable,
      onEdit
    } = this.props;
    const { expand } = this.state;

    return (
      <div
        className={evaluateClassNames({
          [locals.rule]: true,
          [locals.reorderable]: reorderable,
          [locals.disabled]: !enabled,
          [locals.fixed]: !expand
        })}
      >
        <div className={locals.fixedContent}>
          <div className={locals.left}>
            <span className={locals.query}>{name}</span>
            {content}
          </div>

          <div className={locals.right}>
            {isInstanaDefaultRule ? (
              <div className={locals.iconPlaceholder} />
            ) : (
              <SvgIcon
                className={locals.icon}
                type="lib_actions_edit"
                onClick={isInstanaDefaultRule ? null : () => onEdit()}
              />
            )}
            <Toggle className={locals.toggle} checked={enabled} onChange={e => onToggleEnable(e.target.checked)} />
            {expandableContent ? (
              <SvgIcon
                className={locals.icon}
                type={expand ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                onClick={() => this.onExpandToggle()}
              />
            ) : (
              <div className={locals.iconPlaceholder} />
            )}
          </div>
        </div>

        {expand && <div className={locals.expandableContent}>{expandableContent}</div>}
      </div>
    );
  }

  onExpandToggle() {
    this.setState({ expand: !this.state.expand });
  }
}
