import React from 'react';

import Host from 'in-views/logView/Host';

import './LogLine.less';

const block = 'in-log-line';

export default function LogLine({line}) {
  return (
    <div className={block}>
      {!line.continuation ?
        <span>
          <span className={`${block}__time`}>{line.timeFormatted}</span>

          {line.hostSnapshotId ?
            <Host hostSnapshotId={line.hostSnapshotId}
                  time={line.time} />
          : null}

          {line.component ?
            <span className={`${block}__component`}>
              {' ' + line.component}
            </span>
          : null}

          {line.logger ?
            <span className={`${block}__logger`}>
              {' ' + line.logger}
            </span>
          : null}

          {line.level ?
            <span className={`${block}__level`}
                  style={{color: line.levelColor}}>
              {' ' + line.level.toUpperCase()}
            </span>
          : null}

          {': '}
        </span>
      : null}

      <span className={`${block}__message`}>{line.message}</span>
    </div>
  );
}
