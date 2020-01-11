export const baseHomeView = {
  type: "home",
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "I am *Manatee*. I will help you easily access all features of Ocean Protocol :ocean::ocean: right within your slack workspace. Let's get started :v:"
      },
      accessory: {
        type: "image",
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcVoGTmO2BbZqDQcPRSW2Rze634r6GPSEI6Bqj9lbDxcPM2oSz&s",
        alt_text: "manatee logo"
      }
    },
    {
      type: "divider"
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Publish into Ocean Protocol",
            emoji: true
          },
          value: "publish"
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Search in Ocean Protocol",
            emoji: true
          },
          value: "search"
        }
      ]
    }
  ]
}


export const getPublishSuccessHomeView = (did) => {
  let successHomeView = baseHomeView;
  successHomeView.blocks = baseHomeView.blocks.slice();
  successHomeView.blocks.push({
    "type": "context",
    "elements": [
      {
        "type": "image",
        "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
        "alt_text": "placeholder"
      }
    ]
  });
  successHomeView.blocks.push({
    "type": "context",
    "elements": [
      {
        "type": "image",
        "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
        "alt_text": "placeholder"
      }
    ]
  });
  successHomeView.blocks.push({
    "type": "divider"
  })
  successHomeView.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `*Yipee!!* :tada::tada:\n\n You just published a data asset successfully into Ocean Protocol's :ocean: Pacific network. :squid::squid: Here is DID for the published asset - \n\n_${did}_ \n\n You can view or consume this data asset using this link - \n\n https://commons.oceanprotocol.com/asset/${did}`
    }
  });
  successHomeView.blocks.push({
    "type": "context",
    "elements": [
      {
        "type": "image",
        "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
        "alt_text": "placeholder"
      }
    ]
  });
  successHomeView.blocks.push({
    "type": "divider"
  })
  successHomeView.blocks.push(
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Got it!:smile:",
            "emoji": true
          },
          "value": "close-success"
        }]
    })
  return successHomeView;
} 