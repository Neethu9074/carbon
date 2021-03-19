/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { loadDownloadableLogs } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { track, AGENT_LOGS_DOWNLOAD_CLICKED } from 'in-services/tracking/tracking';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { formatDateTime } from 'in-services/formatters/date';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { compareIgnoreCase } from 'in-services/util/string';
import { close } from 'in-components/DialogPresenter/store';
import { bytes } from 'in-services/formatters/number';
import Dialog from 'in-new-components/Dialog/Dialog';
import useObservable from 'in-hooks/useObservable';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from './LogsDownloadList.mless';

const MAX_DOWNLOAD_SIZE = 1024 * 1024 * 20;

const cols = [
  {
    width: '2rem',
    getContent({ name, selectedItems, setSelectedItems }) {
      return (
        <CheckboxFancy
          checked={selectedItems.includes(name)}
          size="large"
          onChange={() => {
            if (selectedItems.includes(name)) {
              setSelectedItems(selectedItems.filter(item => item !== name));
            } else {
              setSelectedItems([...selectedItems, name]);
            }
          }}
        />
      );
    }
  },
  {
    getContent({ name }) {
      return name;
    }
  },
  {
    width: '12rem',
    getContent({ lastModified }) {
      return formatDateTime(lastModified);
    }
  },
  {
    width: '4rem',
    getContent({ size }) {
      return bytes.compact(size);
    }
  }
];

export function getRows(logs = []) {
  return logs.map(({ name, lastModified, size }) => ({
    name,
    lastModified,
    size
  }));
}

export default function LogsDownloadList({ snapshot }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const logsResponse = useObservable(loadDownloadableLogs, [snapshot]);

  // Receiving the 'raw' (un-mapped) response so we can differentiate between nothing received, or no files available.
  const rows = getRows(logsResponse?.data?.logs);
  const downloadSize = rows
    .filter(item => selectedItems.includes(item.name))
    .reduce((acc, current) => acc + current.size, 0);
  // Allowed to select a single large file, or if multiple then below MAX_DOWNLOAD_SIZE
  const isAllowedDownloadSelection = selectedItems.length === 1 || downloadSize <= MAX_DOWNLOAD_SIZE;

  return (
    <Dialog
      title={t('in-forge:plugins.instanaAgent.dashboard.downloadableLogsWithCount', { len: rows.length })}
      onClose={close}
      className={locals.dialog}
    >
      {!logsResponse && <LoadingIndicator />}
      {logsResponse && (
        <>
          {(rows.length > 0 && (
            <>
              <Ul space="xsmall">
                {rows.sort(compareFiles).map(row => (
                  <Li key={row.name}>
                    <ColumnizedContent
                      columnDefinitions={cols}
                      name={row.name}
                      lastModified={row.lastModified}
                      size={row.size}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                    />
                  </Li>
                ))}
              </Ul>
              <div className={locals.buttonMessageBox}>
                <Button
                  icon="lib_actions_download"
                  target="_blank"
                  disabled={selectedItems.length === 0 || !isAllowedDownloadSelection}
                  href={getFormattedUrl(snapshot, selectedItems)}
                  onClick={() => {
                    track(AGENT_LOGS_DOWNLOAD_CLICKED, { files: selectedItems.join(',') });
                    setSelectedItems([]);
                    close();
                  }}
                >
                  {t('in-forge:plugins.instanaAgent.dashboard.download')}
                </Button>
                {!isAllowedDownloadSelection && (
                  <span className={locals.failedTestResult}>
                    {t('in-forge:plugins.instanaAgent.dashboard.theSelectedFilesCollectively', {
                      downloadSize: bytes.compact(downloadSize),
                      maxDownloadSize: bytes.compact(MAX_DOWNLOAD_SIZE)
                    })}
                  </span>
                )}
              </div>
            </>
          )) || <NoDataAvailable text={t('in-forge:plugins.instanaAgent.dashboard.noLogsFound')} height={100} />}
        </>
      )}
    </Dialog>
  );
}

function compareFiles(a, b) {
  return compareIgnoreCase(a.name, b.name);
}

function getFormattedUrl(agentSnapshot, selectedFiles = []) {
  let query = selectedFiles.map(file => 'file=' + encodeURIComponent(file)).join('&');

  if (query.length > 0) {
    query = '&' + query;
  }

  return `/api/host-agent/${encodeURIComponent(
    agentSnapshot?.get('volatileId')?.get('host_id')
  )}/logs?download=true${query}`;
}
