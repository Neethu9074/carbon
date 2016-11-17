import React from 'react';

import {getCurrentViewWithTimelineCenteredAt} from 'in-stores/navigation/timeline';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {formatDateTime} from 'in-services/formatters/date';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Dashboard/components/NotFoundDialog.less';


const block = 'in-dashboard-not-found-dialog';

export default function NotFoundDialog({versionsForFocusedMoment, versionsForLive}) {
  if (!versionsForFocusedMoment && !versionsForLive) {
    return (
      <LoadingIndicator type='dark' />
    );
  }

  const list = mergeVersionLists(versionsForFocusedMoment, versionsForLive).reverse();

  return (
    <div className={block}>
      <h1>
        Dashboard: entity not found
      </h1>

      <p>
        We could not find the a version of the entity for the position of the time picker. Below you will find a
        selection of known versions of this entity. Click on of the versions below to set the timeline and time picker
        so that the entity can be inspected.
      </p>

      <VersionList title='Available entity versions'
                   versions={list} />
    </div>
  );
}


function mergeVersionLists(listA, listB) {
  const result = [];
  const alreadyAdded = {};

  if (listA) {
    listA.forEach(add);
  }
  if (listB) {
    listB.forEach(add);
  }

  return result;

  function add(version) {
    const from = version.get('from');
    const to = version.get('to');
    const id = `${from}:${to}`;

    if (!alreadyAdded[id]) {
      alreadyAdded[id] = true;
      result.push({from, to});
    }
  }
}


function VersionList({title, versions}) {
  versions = versions;

  return (
    <div className={`${block}__list-wrapper`}>
      <p className={`${block}__header`}>
        {title}
      </p>

      <ul className={`${block}__list`}>
        {versions.map(version => {
          const from = version.from;
          const to = version.to;

          return (
            <ListItem key={`${from},${to}`}
                      from={from}
                      to={to} />
          );
        })}
      </ul>
    </div>
  );
}

const ListItem = connectTo(props => {
  return {
    link: getCurrentViewWithTimelineCenteredAt(props.to)
  };
}, function ListItem({from, to, link}) {
  return (
    <li className={`${block}__list-item`}>
      <a href={link}
         className={`${block}__set-time`}>
        <span className={`${block}__key`}>
          from:
        </span>
        <span className={`${block}__value`}>
          {formatDateTime(from)}
        </span>
        <span className={`${block}__key`}>
          to:
        </span>
        <span className={`${block}__value`}>
          {to ? formatDateTime(to) : 'now'}
        </span>
      </a>
    </li>
  );
});
