/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';

import { Observable } from '@instana/observables';
import { Button } from '@instana/components';
import { Cursor } from '@instana/types';

import { t } from 'in-i18n';

import locals from './CsvExporter.mless';

interface CsvExporterProps {
  data?: Data;
  fetchData?: (cursor: Cursor) => Observable<any>;
  headers: Array<string> | undefined;
  fileName?: string;
  processData?: (d: object[], c: object[]) => Data;
  cursor?: Cursor;
  columns?: object[];
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

type Data = object[];

export default function CsvExporter({
  data,
  headers,
  fileName = 'data.csv',
  processData,
  fetchData,
  onClick,
  cursor,
  columns = [{}]
}: CsvExporterProps) {
  const [csvData, setCsvData] = useState<Data>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const csvInstance = useRef<any | null>(null);
  const subscriptionRef = useRef<any | null>(null);

  const asyncExportMethod = () => {
    setIsDisabled(true);

    if (fetchData !== undefined) {
      subscriptionRef.current = fetchData(cursor ?? { offset: 0 }).subscribe(res => {
        if (!res.progress.loading) {
          setCsvData(processData !== undefined ? processData(res?.data?.items, columns) : res?.data?.items);
          setIsDisabled(false);
        }
      });
    }
  };

  useEffect(() => {
    if (csvData && csvInstance && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setCsvData([]);

        // Cancel subscription
        subscriptionRef.current?.dispose();
        subscriptionRef.current = null;
      });
    }
  }, [csvData]);

  let processedData: Data;

  if (data !== undefined) {
    processedData = processData !== undefined ? processData(data, columns) : data;
    return (
      <CSVLink
        className={locals.textDecoration}
        data={processedData}
        headers={headers}
        filename={fileName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button kind="secondary" target="_blank" className={locals.csvExporterButton} size="compact">
          {t('in-components:csvExporterButton.label')}
        </Button>
      </CSVLink>
    );
  } else {
    if (fetchData !== undefined) {
      return (
        <>
          <div
            onClick={e => {
              onClick?.(e);
              asyncExportMethod();
            }}
          >
            <Button
              iconSpinning={isDisabled}
              icon={isDisabled ? 'lib_actions_loading' : undefined}
              disabled={isDisabled}
              kind="secondary"
              target="_blank"
              className={locals.csvExporterButton}
              size="compact"
            >
              {t('in-components:csvExporterButton.label')}
            </Button>
          </div>
          {csvData.length > 0 ? (
            <CSVLink
              data={csvData}
              headers={headers || Object.keys(csvData[0])}
              filename={fileName}
              ref={csvInstance}
              target="_blank"
            />
          ) : undefined}
        </>
      );
    }
    return null;
  }
}
