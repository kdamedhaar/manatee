import express from "express";
import {
  sendViewOpenRequest,
  sendViewUpdateRequest,
  sendViewPublishRequest
} from "../middlewares/request";
import { getPublishSuccessHomeView, getPublishView, publishToOcean, search, results, details, getProgressBar, baseHomeView } from "../views";
import { preparePublishData } from "../middlewares/publish_builder";
const router = express.Router();

let homeView = {
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
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "My Data Wallet",
            emoji: true
          },
          value: "wallet"
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "image",
          "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
          "alt_text": "placeholder"
        }
      ]
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "image",
          "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
          "alt_text": "placeholder"
        }
      ]
    }
  ]
}

// POST request to register new network
router.post("/slack/request", async (req, res, next) => {
  try {
    res.status(200).json();
    callSlack(JSON.parse(req.body.payload));
  } catch (error) {
    console.error(error);
  }
});

// POST request to register new network
router.post("/slack/events", async (req, res, next) => {
  try {
    //handle challenge check
    if (req.body.challenge) {
      res.setHeader('content-type', 'text/plain');
      res.status(200).send(req.body.challenge);
    }

    handleEvents(req.body);

  } catch (error) {
    console.error(error);
  }
});

async function handleEvents(payload) {
  try {
    let event = payload.event;
    switch (event.type) {
      case 'app_home_opened':
        console.log(`User ${event.user} opened Home tab`)
        let resp = await sendViewPublishRequest("https://slack.com/api/views.publish", homeView, event.user);
        if (!resp.data.ok) {
          throw Error(resp.data.message)
        }
        break;
    }
  } catch (error) {
    console.error(error.message)
  }
}
async function callSlack(payload) {
  console.log(payload)
  try {
    let resp;
    switch (payload.type) {
      case "block_actions":
        resp = await handleBlockActions(payload);
        break;
      case "view_submission":
        console.log("selected View Submission");
        resp = await handleViewSubmissions(payload);
        break;
    }

    if (!resp.data.ok) {
      console.log(resp.data)
      throw Error(resp.data.message)
    }

  } catch (error) {
    console.log(error);
  }
}

async function handleBlockActions(payload) {
  console.log(payload.actions[0])
  if (payload.actions[0].value == "publish") {
    let publishView = await getPublishView();

    return await sendViewOpenRequest(
      "https://slack.com/api/views.open",
      publishView,
      payload.trigger_id
    );
  } else if (payload.actions[0].value == "search") {
    return await sendViewOpenRequest(
      "https://slack.com/api/views.open",
      search,
      payload.trigger_id
    );
  } else if (payload.actions[0].value && payload.actions[0].value.startsWith("details")) {
    let values = payload.actions[0].value.split("-");
    let detail_view = await details("pre", values[1]);
    console.log("send details view")
    return await sendViewOpenRequest(
      "https://slack.com/api/views.open",
      detail_view,
      payload.trigger_id
    );
  } else if (payload.actions[0].value && payload.actions[0].value.startsWith("consume")) {
    // TODO send consume req to Ocean agent
    console.log("GOT CONSUME REQUEST")
    console.log(payload.actions[0].value)
    let values = payload.actions[0].value.split("-");
    let detail_view = await details("post", values[1]);
    return await sendViewOpenRequest(
      "https://slack.com/api/views.update",
      detail_view,
      payload.trigger_id,
      payload.view.id
    );

    //await consume(values[1]);
  } else if (payload.actions[0].value == "close-success") {
    return await sendViewPublishRequest(
      "https://slack.com/api/views.publish",
      homeView,
      payload.user.id
    );
  } else if (payload.actions[0].action_id == "result-pages") {
    let pageNo = payload.actions[0].selected_option.value.split("-");
    let page_view = await results(null, parseInt(pageNo[1]));
    return await sendViewPublishRequest(
      "https://slack.com/api/views.publish",
      page_view,
      payload.user.id
    );
  } else if (payload.actions[0].value == "wallet") {
    let results_view = await results(payload.user.id, null, true);
    console.log("!!!!!!!!!!!!!!")
    console.log(JSON.stringify(results_view))
    return await sendViewPublishRequest(
      "https://slack.com/api/views.publish",
      results_view,
      payload.user.id
    );
  }
}

async function handleViewSubmissions(payload) {
  if (payload.view.submit.text == "Publish") {
    let dataTobePublished = await preparePublishData(payload);
    console.log(dataTobePublished)

    let did = await publishToOcean(dataTobePublished);
    if (!did) {
      console.log("Couldnt publish asset. Some error occured.")
    }
    else {
      console.log("Successfully published data to Ocean with DID - ", did);
      let successView = getPublishSuccessHomeView(did);
      return await sendViewPublishRequest(
        "https://slack.com/api/views.publish",
        successView,
        payload.user.id
      );
    }
  } else {
    let searchQuery = payload.view.state.values['search-input']['search-box'].value;

    let results_view = await results(searchQuery, null, false);
    return await sendViewPublishRequest(
      "https://slack.com/api/views.publish",
      results_view,
      payload.user.id
    );
  }

}


export default router;
