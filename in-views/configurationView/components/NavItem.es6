import React from 'react';

import NavItems from 'in-views/configurationView/components/NavItems';
import { evaluateClassNames } from 'in-services/util/classnames';
import Collapsible from 'in-components/Collapsible';
import connectTo from 'in-hoc/connectTo';

import './NavItem.less';

const block = 'in-config-view-nav-item';

export default connectTo(
  props => {
    return {
      href: props.href$,
      isActive: props.isActive$
    };
  },
  function NavItem({ href, isActive, children, borderless, title }) {
    const childCount = React.Children.count(children);

    if (childCount > 0) {
      return (
        <li className={block}>
          <Collapsible>
            <Collapsible.Header>
              {title}
            </Collapsible.Header>
            <Collapsible.Content>
              <NavItems>
                {children}
              </NavItems>
            </Collapsible.Content>
          </Collapsible>
        </li>
      );
    }

    return (
      <li
        className={evaluateClassNames({
          [block]: true,
          [`${block}__borderless`]: borderless
        })}
      >
        <a
          href={href}
          onClick={e => onClick(e, href)}
          className={evaluateClassNames({
            [`${block}__link`]: true,
            [`${block}__link--active`]: isActive
          })}
        >
          {title}
        </a>
      </li>
    );
  }
);

function onClick(e, href) {
  if (!href) {
    e.preventDefault();
  }
}
