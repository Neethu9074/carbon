/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useRef, forwardRef, ReactNode, useState, ChangeEvent } from 'react';

import { Button } from '@instana/components';

import { number } from 'in-services/formatters/number';
import { compositeRef } from 'in-services/util/react';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './FileInputButton.mless';

export type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'type'> & {
  children?: ReactNode;
  icon?: string;
};

export default forwardRef<HTMLInputElement, Props>(function FileInput({ children, ...inputProps }: Props, outerRef) {
  const [fileList, setFileList] = useState<FileList | File[] | undefined>();
  const ref = useRef<HTMLInputElement | undefined>();
  const icon = inputProps.icon ?? 'lib_views_file';

  if (!children) {
    if (!fileList || fileList.length === 0) {
      children = (inputProps as any).multiple
        ? t('in-components:fileInputButton.label.chooseMultiple')
        : t('in-components:fileInputButton.label.chooseSingle');
    } else {
      if (fileList.length === 1) {
        children = shorten(fileList[0].name, 32) as string;
      } else {
        children = t('in-components:fileInputButton.label.multipleSelected', {
          count: fileList.length,
          countFormatted: number.compact(fileList.length)
        });
      }
    }
  }

  return (
    <label htmlFor={inputProps.id}>
      <input
        className={locals.input}
        type="file"
        {...inputProps}
        ref={compositeRef(ref, outerRef)}
        onChange={onChange}
        data-testid="file-selector"
      />
      <Button
        kind="secondary"
        icon={icon}
        disabled={inputProps.disabled}
        onClick={e => {
          e.preventDefault();
          ref.current?.click();
        }}
      >
        {children}
      </Button>
    </label>
  );

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFileList(e.target.files);
    } else {
      setFileList([]);
    }
    inputProps.onChange?.(e);
  }
});
