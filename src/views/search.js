export default {
  type: "modal",
  title: {
    type: "plain_text",
    text: "Search in Ocean",
    emoji: true
  },
  submit: {
    type: "plain_text",
    text: "Search",
    emoji: true
  },
  close: {
    type: "plain_text",
    text: "Cancel",
    emoji: true
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "Which *data assets* would you like to search for in Ocean Protocol?"
      }
    },
    {
      type: "input",
      block_id: "search-input",
      element: {
        type: "plain_text_input",
        action_id: "search-box",
        placeholder: {
          type: "plain_text",
          text: "(e.g.) Trees in Amazon"
        }
      },
      label: {
        type: "plain_text",
        text: "Search Query :eyes:",
        emoji: true
      }
    }
  ]
};
