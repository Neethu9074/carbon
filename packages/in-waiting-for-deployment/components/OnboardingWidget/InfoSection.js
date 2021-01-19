/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './InfoSection.mless';

export default function InfoSection({ trackingService }) {
  return (
    <div className={locals.section}>
      <div className={locals.leftContent}>
        <SvgIcon className={locals.icon} type="lib_datetime_timer" size="xl" />
        <span className={locals.description}>While we get you started, would you like to…</span>
      </div>

      <div className={locals.rightContent}>
        <span className={locals.subText}>Get a feeling for Instana with highlights of what it can do</span>
        <Button
          className={locals.button}
          kind="secondary"
          icon="lib_actions_play_circle"
          target="_blank"
          rel="noopener noreferrer"
          href="https://support.instana.com/hc/en-us/articles/360020285271-Instana-Videos-for-Beginners"
          onClick={() => trackingService.beginnerVideosClicked()}
        >
          Watch example videos
        </Button>
      </div>
    </div>
  );
}
