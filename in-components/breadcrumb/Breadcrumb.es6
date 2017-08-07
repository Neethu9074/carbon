import React from 'react';

import { buildUrlStream } from 'in-stores/navigation';
import PluginIcon from 'in-components/PluginIcon';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './Breadcrumb.less';

const block = 'in-breadcrumb';
const iconElement = `${block}__icon`;

export default connectTo(
  props => {
    if (props.path) {
      return {
        path: buildUrlStream({ path: [props.path] })
      };
    }
    return {
      path: props.path$
    };
  },
  function Breadcrumb({ label, path, snapshot }) {
    return (
      <Link href={path} className={block}>
        {snapshot
          ? <span className={iconElement}>
              <PluginIcon dimension={14} color="#fff" snapshot={snapshot} />
            </span>
          : null}{' '}
        {label}
      </Link>
    );
  }
);
