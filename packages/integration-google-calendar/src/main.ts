import { BaseGAS, BaseGASParams } from 'lib/src/base-gas';
import { sendSlack } from 'lib/src/send-slack';

class IntegrationGoogleCalendar extends BaseGAS {
  constructor(params: BaseGASParams) {
    super(params);
  }

  /**
   * カレンダーのイベントを取得する
   * @returns {GoogleAppsScript.Calendar.CalendarEvent[]}
   */
  getCalendarEvent({
    startHours,
    endHours
  }: {
    startHours: number;
    endHours: number;
  }): GoogleAppsScript.Calendar.CalendarEvent[] {
    const myCalendar = CalendarApp.getCalendarById(this.GOOGLE_CALENDAR_ID);
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHours, 0, 0, 0);
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHours - 1, 59, 59, 999);
    const myEvent = myCalendar.getEvents(startDate, endDate);
    return myEvent;
  }

  /**
   * メッセージを作成する
   * @param {GoogleAppsScript.Calendar.CalendarEvent[]} calendarEvent
   * @returns {string}
   */
  createMessage(calendarEvent: GoogleAppsScript.Calendar.CalendarEvent[]): string {
    const googleCalenderEditURL = 'https://calendar.google.com/calendar/u/0/r/eventedit/';
    const today = new Date().toLocaleDateString('ja-JP', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const message: string[] = [];
    message.push(`*${today}の予定*`);
    for (let i = 0; i < calendarEvent.length; i++) {
      if (calendarEvent[i].isAllDayEvent()) continue;
      const startHours = ('0' + calendarEvent[i].getStartTime().getHours()).slice(-2);
      const startMinutes = ('0' + calendarEvent[i].getStartTime().getMinutes()).slice(-2);
      const endHours = ('0' + calendarEvent[i].getEndTime().getHours()).slice(-2);
      const endMinutes = ('0' + calendarEvent[i].getEndTime().getMinutes()).slice(-2);
      const eventId = calendarEvent[i].getId().split('@')[0];
      const eventURL = googleCalenderEditURL + Utilities.base64Encode(eventId + ' ' + this.GOOGLE_CALENDAR_ID);
      const title = `<${eventURL} | ${calendarEvent[i].getTitle()}>`;
      message.push(`${startHours + ':' + startMinutes}~${endHours + ':' + endMinutes}->${title}`);
    }
    return message.join('\n');
  }

  /**
   * メッセージを送信する
   * @param {string} message
   */
  sendMessage(message: string): void {
    sendSlack(this.SLACK_CHANNEL_NAME, message, this.SLACK_TOKEN);
  }
}

(global as any).process = () => {
  const integrationGoogleCalendar = new IntegrationGoogleCalendar({
    isIntegrationGoogleCalendar: true,
    isIntegrationSlack: true
  });
  const event = integrationGoogleCalendar.getCalendarEvent({ startHours: 8, endHours: 22 });
  const message = integrationGoogleCalendar.createMessage(event);
  integrationGoogleCalendar.sendMessage(message);
};
