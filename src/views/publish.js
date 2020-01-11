import axios from 'axios';

export const getPublishView = async () => {
  let options = await processCategories();
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Publish in Ocean",
      emoji: true
    },
    submit: {
      type: "plain_text",
      text: "Publish",
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
            "Hi there, I am here to assist you publish data-assets to Ocean Protocol. So, let's get started.\n\n *Please fill in the details:*"
        }
      },
      {
        type: "input",
        block_id: "block_title",
        label: {
          type: "plain_text",
          text: "Title"
        },
        element: {
          type: "plain_text_input",
          action_id: "input_title",
          placeholder: {
            type: "plain_text",
            text: "(e.g.) Trees planted in Amazon in 2019"
          }
        }
      },
      {
        type: "input",
        block_id: "block_description",
        element: {
          type: "plain_text_input",
          action_id: "input_description",
          multiline: true,
          placeholder: {
            type: "plain_text",
            text:
              "(e.g.) This data is about trees planted in Amazon rainforest in the year of 2019."
          }
        },
        label: {
          type: "plain_text",
          text: "Description",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_url",
        element: {
          type: "plain_text_input",
          action_id: "input_url",
          placeholder: {
            type: "plain_text",
            text: "(e.g.) http://www.example.com/dataurl"
          }
        },
        label: {
          type: "plain_text",
          text: "Data Url",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_createdon",
        element: {
          type: "datepicker",
          action_id: "input_createdon",
          initial_date: "2019-12-25",
          placeholder: {
            type: "plain_text",
            text: "Select a date",
            emoji: true
          }
        },
        label: {
          type: "plain_text",
          text: "Created on",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_author",
        element: {
          action_id: "input_author",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "(e.g.) Vitalik Buterin"
          }
        },
        label: {
          type: "plain_text",
          text: "Author",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_copyright",
        element: {
          action_id: "input_copyright",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "(e.g.) Satoshi Nakamoto"
          }
        },
        label: {
          type: "plain_text",
          text: "Copyright Holder",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_license",
        element: {
          action_id: "input_license",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "(e.g.) Apache 2.0"
          }
        },
        label: {
          type: "plain_text",
          text: "License",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_price",
        element: {
          action_id: "input_price",
          type: "plain_text_input",
          placeholder: {
            type: "plain_text",
            text: "(e.g.) 10"
          }
        },
        label: {
          type: "plain_text",
          text: "Price",
          emoji: true
        }
      },
      {
        type: "input",
        block_id: "block_categories",
        element: {
          action_id: "input_categories",
          type: "multi_static_select",
          placeholder: {
            type: "plain_text",
            text: "Engineering"
          },
          options
        },
        label: {
          type: "plain_text",
          text: "Select Categories",
          emoji: true
        }
      }
    ]
  }
};

export const getPublishSucessView = (did) => {
  return {
    "type": "modal",
    "title": {
      "type": "plain_text",
      "text": "Publish successful :100:",
      "emoji": true
    },
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Yipee!!* :tada::tada:\n\n You just published a data asset successfully into Ocean Protocol's :ocean: Pacific network. :squid::squid: Here is DID for the published asset - \n\n_${did}_ \n\n You can view or consume this data asset using this link - \n\n https://commons.oceanprotocol.com/asset/${did}`
        }
      }
    ]
  }
}

const processCategories = async () => {
  let categories = [
    "Image Recognition",
    "Dataset Of Datasets",
    "Language",
    "Performing Arts",
    "Visual Arts & Design",
    "Philosophy",
    "History",
    "Theology",
    "Anthropology & Archeology",
    "Sociology",
    "Psychology",
    "Politics",
    "Interdisciplinary",
    "Economics & Finance",
    "Demography",
    "Biology",
    "Chemistry",
    "Physics & Energy",
    "Earth & Climate",
    "Space & Astronomy",
    "Mathematics",
    "Computer Technology",
    "Engineering",
    "Agriculture & Bio Engineering",
    "Transportation",
    "Urban Planning",
    "Health & Medicine",
    "Business & Management",
    "Sports & Recreation",
    "Communication & Journalism",
    "Deep Learning",
    "Law",
    "Other"
  ];

  let updatedCategories = await Promise.all(categories.map(cat => {
    return {
      "text": {
        "type": "plain_text",
        "text": cat,
        "emoji": true
      },
      "value": cat.replace(" ", "")
    }
  }
  ))

  console.log(updatedCategories);
  return updatedCategories;
}


export const publishToOcean = async (data) => {
  try {

    let resp = await axios(
      {
        method: 'post',
        url: "https://agent.oceanprotocol.com/api/general/publish",
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*"
        },
        data
      });

    if (resp.status != 200) {
      return null;
    }

    let did = resp.data;
    console.log(did);
    return did;
  } catch (err) {
    console.error(err.message);
    return null;
  }


}