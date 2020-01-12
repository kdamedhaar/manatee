
import { fillArray } from '../middlewares/parseResults';

export const stockImages = [
  "http://news.mit.edu/sites/mit.edu.newsoffice/files/images/2016/MIT-Automatic-Data_0.jpg",
  "https://thesocietypages.org/sociologylens/files/2013/04/big-data.jpg",
  "https://i.ytimg.com/vi/xUzV9fx2__s/maxresdefault.jpg",
  "https://www.clinicaltrialsarena.com/wp-content/uploads/sites/33/2018/02/shutterstock_649122700-1000x672.jpg",
  "http://venturesafrica.com/wp-content/uploads/2018/03/ehealth-first-how-big-data-and-blockchain-tech-will-improve-healthcare-outcomes.jpg",
  "https://cdn.datafloq.com/blog_pictures/how-big-data-is-changing-the-world-around-us.jpg",
  "https://graduate.carleton.ca/wp-content/uploads/th-data-science.jpg",
  "https://www.sas.com/en_ae/training/academy-data-science/data-science-certification/_jcr_content/socialShareImage.img.png"
]

export async function createSearchResultsView(results, totalResults, totalPages, page, isDataWallet) {
  let blocks = [];
  let view = {
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
  };
  blocks = await addResultsCount(blocks, results.length, totalResults, totalPages, page, isDataWallet);
  blocks = addDivider(blocks);
  console.log("***********BEFORE*****************************@@")
  console.log(JSON.stringify(view.blocks.length + blocks.length))
  console.log(JSON.stringify(results.length))
  blocks = await createCardsView(blocks, results);
  view.blocks.push(...blocks);
  //console.log("***************AFTER*************************@@")
  console.log(JSON.stringify(view.blocks))
  return view;
}

async function createCardsView(blocks, results) {
  let resp = results.reduce((res, result) => {
    let { section, context, actions, divider } = createResultBlock(result);
    res.push(section);
    res.push(context);
    res.push(actions);
    res.push(divider);
    return res;
  }, []);
  let finalBlocks = blocks.concat(resp.slice());

  return finalBlocks.slice();
}

function createResultBlock(result) {
  let section = {
    type: "section",
    accessory: {
      type: "image",
      image_url: "https://miro.medium.com/max/19664/1*c8p4mZQI_X5DJLH4jpp5_A.png", //`${stockImages[Math.floor(Math.random() * stockImages.length)]}`,
      alt_text: "data"
    },
    text: {
      type: "mrkdwn",
      text: `*<https://commons.oceanprotocol.com/asset/${result.id}|${result.name}>*\n _type_ : ${result.type}\n _author_ : ${result.author}\n _license_ : ${result.license}\n`
    }
  };

  let context = {
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text:
          "_price_ : " + `${result.price == 0 ? "FREE" : result.price + " OCEAN"}`
      },
      {
        type: "mrkdwn",
        text: `_total files_ : ${result.files.length}`
      }
    ]
  };

  let actions = {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "View Details",
          emoji: true
        },
        value: `details-${result.id}`
      }
    ]
  };

  let divider = {
    type: "divider"
  };

  return { section, context, actions, divider };
}

async function addResultsCount(blocks, showcount, count, totalPages, page, isDataWallet) {
  console.log(totalPages)
  let fakeArr = fillArray(1, totalPages);

  console.log(fakeArr)

  let optionsArr = await Promise.all(fakeArr.map((obj, i) => {
    return {
      "text": {
        "type": "plain_text",
        "text": `Page ${i + 1}`
      },
      "value": `page-${i + 1}`
    }
  }));
  console.log(optionsArr)

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `${isDataWallet ? `*My Data Wallet* :ledger:` : `*Found ${count} results* :tada::tada:`} _Showing ${((page - 1) * showcount) + 1} to ${page * showcount}_`
    },
    accessory: {
      action_id: "result-pages",
      type: "static_select",
      placeholder: {
        type: "plain_text",
        text: `Page ${page}`
      },
      options: optionsArr.slice()
    }
  });
  return blocks.slice();
}

function addDivider(blocks) {
  blocks.push({
    type: "divider"
  });
  return blocks.slice();
}


//createSearchResultsView(staticView, results);
