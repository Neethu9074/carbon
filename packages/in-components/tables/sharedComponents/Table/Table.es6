import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import locals from './Table.mless';

export function Table(props) {
  return <table {...props} className={joinClassNames(props.className, locals.table)} cellSpacing="0" />;
}

export function Thead(props) {
  return <thead {...props} />;
}

export function Tbody(props) {
  return <tbody {...props} />;
}

export function Tr(props) {
  return <tr {...props} className={joinClassNames(props.className, locals.tr)} />;
}

export function Th(props) {
  return <th {...props} className={joinClassNames(props.className, locals.th)} />;
}

export function Td(props) {
  return <td {...props} className={joinClassNames(props.className, locals.td)} />;
}
