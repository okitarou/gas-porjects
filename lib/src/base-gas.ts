export type BaseGASParams = {
  isIntegrationSlack?: boolean;
  isIntegrationGoogleCalendar?: boolean;
};

export class BaseGAS {
  protected readonly SLACK_TOKEN: string;
  protected readonly SLACK_CHANNEL_NAME: string;
  protected readonly GOOGLE_CALENDAR_ID: string;
  constructor(params: BaseGASParams) {
    if (params.isIntegrationSlack) {
      this.SLACK_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN') ?? '';
      this.SLACK_CHANNEL_NAME = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_NAME') ?? '';
      if (this.SLACK_TOKEN === '') throw new Error('SLACK_TOKEN is not set');
      if (this.SLACK_CHANNEL_NAME === '') throw new Error('SLACK_CHANNEL_NAME is not set');
    }

    if (params.isIntegrationGoogleCalendar) {
      this.GOOGLE_CALENDAR_ID = PropertiesService.getScriptProperties().getProperty('GOOGLE_CALENDAR_ID') ?? '';
      if (this.GOOGLE_CALENDAR_ID === '') throw new Error('GOOGLE_CALENDAR_ID is not set');
    }
  }
}
