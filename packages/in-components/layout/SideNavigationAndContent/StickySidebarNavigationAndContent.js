/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent/SideNavigationAndContent';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';

/**
 * Takes a single array of pages and converts it into a navigation tree.
 */
export default function StickySidebarNavigationAndContent(props) {
  return <SideNavigationAndContent {...props} NotFoundPage={NotFoundPage} stickySidebar />;
}
