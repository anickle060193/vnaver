export const enum UpdaterState
{
  None = 'None',
  CheckingForUpdate = 'CheckingForUpdate',
  UpdateAvailable = 'UpdateAvailable',
  UpdateNotAvailable = 'UpdateNotAvailable',
  UpdateDownloaded = 'UpdateDownloaded',
  Error = 'Error'
}

export interface ProgressInfo
{
  bytesPerSecond: number;
  percent: number;
  total: number;
  transferred: number;
}
