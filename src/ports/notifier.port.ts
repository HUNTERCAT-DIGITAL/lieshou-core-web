/** 通知端口：提示（各端注入——antd message / RN Toast / Taro showToast） */
export interface NotifierPort {
  success(msg: string): void;
  error(msg: string): void;
}
