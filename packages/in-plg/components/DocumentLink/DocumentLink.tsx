/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

interface DocumentLinkProps {
  text: string;
  href: string;
}

const DocumentLink: React.FC<DocumentLinkProps> = ({ text, href }) => {
  return (
    <Link href={href} target="_blank">
      {text}
    </Link>
  );
};

export default DocumentLink;
