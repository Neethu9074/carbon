import React from 'react';

import {formatDateTime} from 'in-services/formatters/date';
import {setFocusedMoment} from 'in-stores/timeline';

import 'in-components/Dashboard/components/NotFoundDialog.less';


const block = 'in-dashboard-not-found-dialog';
const maxVersionsPerList = 5;

export default function NotFoundDialog({versionsForFocusedMoment, versionsForLive}) {
  return (
    <div className={block}>
      <h1>
        Please use one of the following versions
      </h1>
      <p>
        The current selected entity is not online anymore but there are historical version available.
        Please select one of the following timeranges.
        <br/>
        The UI will jump back in time to the versions date.
      </p>

      <VersionList title='Historical versions'
                   versions={versionsForFocusedMoment} />

      <VersionList title='Live versions'
                   versions={versionsForLive}
                   isLiveList={true} />
    </div>
  );
}

function VersionList({title, versions, isLiveList = false}) {
  versions = versions.toArray()
                     .slice(0, maxVersionsPerList);

  return (
    <div className={`${block}__list-wrapper`}>
      <p className={`${block}__header`}>
        {title}
      </p>

      <ul className={`${block}__list`}>
        {versions.map((version, index) => {
          const from = version.get('from');
          const to = version.get('to', null);
          const isLastKnownVersion = (isLiveList && (index === versions.length - 1));

          if (isLastKnownVersion) {
            return (
              <div key={`${from},${to}`}>
                <p className={`${block}__last-known`}>
                  Last known
                </p>
                <ListItem from={from}
                          to={to} />
              </div>
            );
          }

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

function ListItem({from, to}) {
  return (
    <li className={`${block}__list-item`}
        onClick={() => onVersionClick(to)}>
      <span className={`${block}__key`}>
        from:
      </span>
      <div className={`${block}__value`}>
        {formatDateTime(from)}
      </div>
      <span className={`${block}__key`}>
        to:
      </span>
      <div className={`${block}__value`}>
        {to ? formatDateTime(to) : 'active'}
      </div>
    </li>
  );
}

function onVersionClick(time) {
  setFocusedMoment(time);
}
