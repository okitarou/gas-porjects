// Sync Mazrica Zoom
// https://api.slack.com/apps

// chat.postMessage
// Sends a message to a channel.
// https://api.slack.com/methods/chat.postMessage
type ChatPostMessageResponse = {
  ok: boolean;
  channel: string;
  ts: string;
  message: {
    text: string;
    username: string;
    bot_id: string;
    attachments: {
      text: string;
      id: number;
      fallback: string;
    }[];
    type: string;
    subtype: string;
    ts: string;
  };
};

function chatPostMessage(
  data: {
    channel: string;
    attachments?: string;
    blocks?: string;
    text?: string;
    thread_ts?: string;
  },
  token: string
): ChatPostMessageResponse {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${token}`
    },
    payload: JSON.stringify(data)
  };
  const response = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options);
  const result = JSON.parse(response.getContentText()) as ChatPostMessageResponse;
  return result;
}

function main() {
  const token = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN') ?? '';
  const channel = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID') ?? '';
  const text = `# Hello there`;
  const result1 = chatPostMessage({ channel, text }, token);
  const result2 = chatPostMessage({ channel, text, thread_ts: result1.message.ts }, token);
  Logger.log(result1.ts);
  return 'sync-mazrica-zoom';
}

global.main = main;
