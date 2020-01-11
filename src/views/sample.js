export default {
  type: "modal",
  callback_id: "modal-identifier",
  title: {
    type: "plain_text",
    text: "Just a modal"
  },
  blocks: [
    {
      type: "section",
      block_id: "section-identifier",
      text: {
        type: "mrkdwn",
        text: "*Welcome* to ~my~ Block Kit _modal_!"
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Just a button"
        },
        action_id: "button-identifier"
      }
    }
  ]
};
