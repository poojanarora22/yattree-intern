export type AppAlertType = {
  title?: string;
  message: string;
  onOK?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
};
