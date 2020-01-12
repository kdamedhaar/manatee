import axios from 'axios';
import { searchMetadata, slackifyDescription } from "../middlewares/parseResults";
import { stockImages } from '../middlewares/results_builder';

export default async (type, did) => {
    let details = await getResultDetails(did);
    console.log("****************")
    console.log(details)
    let detailBlocks = [
        {
            "type": "divider"
        },
        {
            "type": "section",
            "accessory": {
                "type": "image",
                "image_url": `${stockImages[Math.floor(Math.random() * stockImages.length)]}`,
                "alt_text": `${details.id}`
            },
            "text": {
                "type": "mrkdwn",
                "text": `_author_ : ${details.author}\n _type_ : ${details.type} \n _created on_ : ${details.dateCreated} \n _price_ : ${details.price ? "FREE" : details.price + " OCEAN"}`
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Description*"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": details.description.substring(0, 2990)
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Total ${details.files.length} files`
            }
        }
    ]
    let blocksView = await createFileView(type, detailBlocks, details);
    let view = {
        "type": "modal",
        "title": {
            "type": "plain_text",
            "text": `${details.name || "Dataset details"}`,
            "emoji": true
        },
        "close": {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        }
    }
    //add blocks to view
    view.blocks = blocksView.slice();
    return view;
}

const createFileView = async (type, view, details) => {
    await Promise.all(details.files.map(file => {
        view.push({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `_filetype_ :  ${file.contentType} \n _filesize_ : ${!file.contentLength ? 'unknown' : file.contentLength}`
            }
        })
    }))

    //just a blank space
    view.push({
        "type": "context",
        "elements": [
            {
                "type": "image",
                "image_url": "https://api.slack.com/img/blocks/bkb_template_images/placeholder.png",
                "alt_text": "placeholder"
            }
        ]
    });

    //add consume url
    view.push({
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `*<https://commons.oceanprotocol.com/asset/${details.id}|Download Data>* :file_folder:`
        }
    });

    return view;
}

async function getResultDetails(did) {
    console.log(`DID - ${did}`)
    let resp = await axios(`https://aquarius.commons.oceanprotocol.com/api/v1/aquarius/assets/ddo/${did}`);

    let metadata = searchMetadata(resp.data.service);
    let result = metadata.attributes.main;
    //get title
    result.name = (metadata.attributes.main.name.length >= 24) ? `${metadata.attributes.main.name.substring(0, 22)}..` : metadata.attributes.main.name;
    result.id = did;
    result.description = slackifyDescription(metadata);
    return result;
}