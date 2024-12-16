/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card, Li, Stack, SvgIcon, Ul } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { LocationListItem } from '@instana/types';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { t } from 'in-i18n';

import locals from './columnDefinitions.mless';

interface ContentProps {
  ipAddressList: string[];
  close: () => void;
}

const getIPAddressColumnText = (ipAddressCount: number): string => {
  if (ipAddressCount === 1) {
    return t('in-synthetics:dashboard.locationList.ipAddressColumn.singleIPAddress', { number: ipAddressCount });
  }
  return t('in-synthetics:dashboard.locationList.ipAddressColumn.multipleIPAddress', { number: ipAddressCount });
};

const IPAddressPresenter = ({ item }: { item: LocationListItem }) => {
  let ipAddressList: string[] = item?.ipAddresses ?? [];
  if (item.type === 'Private' || ipAddressList.length === 0) {
    return (
      <span className={locals.label}>{t('in-synthetics:dashboard.locationList.ipAddressColumn.noIPAddresses')}</span>
    );
  }

  return (
    <Overlay
      props={{
        ipAddressList
      }}
      content={Content}
      align="auto"
    >
      {({ toggle }) => (
        <HorizontalFlexWrapper>
          <div onClick={toggle}>
            <span className={locals.ipAddressLabel}>{getIPAddressColumnText(ipAddressList.length)}</span>
          </div>
        </HorizontalFlexWrapper>
      )}
    </Overlay>
  );
};

const Content = (props: ContentProps) => {
  const { ipAddressList, close } = props;

  return (
    <Card
      title={getIPAddressColumnText(ipAddressList.length)}
      rightHeaderContent={<SvgIcon type="lib_openclose_cancel" size="s" onClick={close} />}
      isScrollable
    >
      <Stack>
        <Ul className={locals.ipAddressList}>
          {ipAddressList.map((ipAddress: string) => {
            return (
              <Li className={locals.issue} key={generateUniqueShortId()}>
                <span className={locals.label}>{ipAddress}</span>
              </Li>
            );
          })}
        </Ul>
      </Stack>
    </Card>
  );
};

export default IPAddressPresenter;
