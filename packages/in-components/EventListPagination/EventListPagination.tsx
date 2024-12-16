/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, Typography, Button } from '@instana/components';
import { t } from '@instana/i18n-react';

interface EventListPaginationProps {
  pageNum: number;
  numPages: number;
  setPageNum: React.Dispatch<React.SetStateAction<number>>;
}

export default function EventListPagination({ pageNum, numPages, setPageNum }: EventListPaginationProps) {
  return (
    <Stack direction="horizontal" align="center" gap="xsmall">
      <Stack direction="horizontal" align="center" gap="xxsmall">
        <Typography variant="body-regular">{t('in-events:RCA.entitiesNumber')}</Typography>
        <Button
          icon="lib_arrow_expand_left"
          kind="subtle"
          onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
          disabled={pageNum === 1}
        >
          <></>
        </Button>
      </Stack>
      <Stack direction="horizontal" gap="xsmall" align="center">
        <Typography variant="body-small">{pageNum}</Typography>
        <Typography variant="body-regular">{'/'}</Typography>
        <Typography variant="body-small">{numPages}</Typography>
      </Stack>
      <Button
        icon="lib_arrow_expand_right"
        kind="subtle"
        onClick={() => pageNum < numPages && setPageNum(pageNum + 1)}
        disabled={pageNum >= numPages}
      >
        <></>
      </Button>
    </Stack>
  );
}
