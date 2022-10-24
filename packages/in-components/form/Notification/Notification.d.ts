/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

interface NotificationProps {
  children: React.ReactNode;
  success?: boolean;
  failure?: boolean;
  loading?: boolean;
}

declare function NotificationComponent(props: NotificationProps): JSX.Element;

export default NotificationComponent;
