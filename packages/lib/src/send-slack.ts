declare const SlackApp: any;
/**
 * 事前にGASライブラリからSlackAppを導入する必要がある
 */
export function sendSlack(channelId: string, message: string, slackToken: string) {
  // SlackAppオブジェクトのpostMessageメソッドでボット投稿を行う
  const slackApp = SlackApp.create(slackToken);
  slackApp.postMessage(channelId, message);
}
