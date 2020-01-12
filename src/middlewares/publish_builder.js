import { details } from "../views"
import { text } from "express";

export const preparePublishData = async (payload) => {

    let details = {};
    details.title = payload.view.state.values['block_title']['input_title'].value;
    details.description = payload.view.state.values['block_description']['input_description'].value;
    details.url = payload.view.state.values['block_url']['input_url'].value;
    details.author = payload.view.state.values['block_author']['input_author'].value;
    details.createdOn = payload.view.state.values['block_createdon']['input_createdon'].selected_date;
    details.copyright = payload.view.state.values['block_copyright']['input_copyright'].value;
    details.license = payload.view.state.values['block_license']['input_license'].value;
    details.price = payload.view.state.values['block_price']['input_price'].value;
    details.categories = payload.view.state.values['block_categories']['input_categories'].selected_options.slice();
    details.publisher = payload.user.id;

    let selectedCategories = await Promise.all(details.categories.map(cat => cat.text.text));


    return {
        "publisher": "",
        "metadata": {
            "main": {
                "name": `${details.title}`,
                "dateCreated": `${details.createdOn}T00:00:00Z`,
                "author": `${details.author}`,
                "license": `${details.license}`,
                "price": `${details.price * (10 ** 18)}`,
                "files": [
                    {
                        "index": 0,
                        "contentType": "application/file",
                        "checksum": "2bf9d229d110d1976cdf85e9f3256c7f",
                        "checksumType": "MD5",
                        "contentLength": "12057507",
                        "compression": "zip",
                        "encoding": "UTF-8",
                        "url": `${details.url}`
                    }
                ],

                "type": "dataset"
            },
            "additionalInformation": {
                "publisher": `${details.publisher}`,
                "checksum": "",
                "categories": [`${selectedCategories}`],
                "tags": [
                    "manatee"
                ],
                "description": `${details.description}`,
                "copyrightHolder": `${details.copyright}`,
                "workExample": "image path, id, label",
                "links": [],
                "inLanguage": "en"
            }
        }
    }
}

