
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
export async function createSearchResultsView(view, results) {
  let blocks = [];
  blocks = addResultsCount(blocks, results);
  blocks = addDivider(blocks);
  blocks = await createCardsView(blocks, results);
  view.blocks = blocks.slice();
  return view;
  //console.log(JSON.stringify(view));
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
      image_url: `${stockImages[Math.floor(Math.random() * stockImages.length)]}`,
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

function addResultsCount(blocks, results) {
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `*Found ${results.length} results* :tada:`
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
