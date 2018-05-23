import { assign } from 'lodash';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { joinClassNames } from 'in-services/util/classnames';
import locals from './Table.mless';

export function Table(props) {
  const reducedProps = assign({}, props);
  delete reducedProps.tableInCard;

  const className = evaluateClassNames({
    [joinClassNames(props.className, locals.table)]: true,
    [locals.tableInCard]: props.tableInCard
  });
  return <table {...reducedProps} className={className} cellSpacing="0" />;
}

export function Thead(props) {
  return <thead {...props} />;
}

export function Tbody(props) {
  return <tbody {...props} />;
}

export function Tr(props) {
  return (
    <tr
      {...props}
      className={evaluateClassNames({
        [joinClassNames(props.className, locals.tr, locals[`depth-${props.depth || 1}`])]: true,
        [locals.trCompcat]: props.size === 'compact',
        [locals.trRegular]: props.size !== 'compact'
      })}
    />
  );
}

export function Th(props) {
  return <th {...props} className={joinClassNames(props.className, locals.th)} />;
}

export function Td(props) {
  return <td {...props} className={joinClassNames(props.className, locals.td)} />;
}
