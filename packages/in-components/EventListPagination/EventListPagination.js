/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack, SvgIcon, Typography } from '@instana/components';

export default function EventListPagination({ pageNum, numPages, setPageNum }) {
  return (
    <Stack direction="horizontal">
      <SvgIcon
        type="lib_arrow_expand_left"
        onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
        color={pageNum === 1 ? '#00000080' : undefined}
      />
      <Stack direction="horizontal" gap="xsmall" align="center">
        <Typography variant="body-small">{pageNum}</Typography>
        <Typography variant="body-regular">{'/'}</Typography>
        <Typography variant="body-small">{numPages}</Typography>
      </Stack>
      <SvgIcon
        type="lib_arrow_expand_right"
        onClick={() => pageNum < numPages && setPageNum(pageNum + 1)}
        color={pageNum >= numPages ? '#00000080' : undefined}
      />
    </Stack>
  );
}
