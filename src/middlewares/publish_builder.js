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

    let selectedCategories = await Promise.all(details.categories.map(cat => cat.text.text));


    return {
        "name": `${details.title}`,
        "description": `${details.description}`,
        "author": `${details.author}`,
        "license": `${details.license}`,
        "copyrightHolder": `${details.copyright}`,
        "dateCreated": `${details.createdOn}T00:00:00Z`,
        "price": details.price * (10 ** 18),
        "type": "dataset",
        "files": [
            {
                "index": 0,
                "contentType": "application/zip",
                "contentLength": "120575",
                "compression": "zip",
                "encoding": "UTF-8",
                "url": `${details.url}`
            }
        ],
        "categories": [`${selectedCategories}`]
    }

}