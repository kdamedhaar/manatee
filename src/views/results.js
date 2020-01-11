//import { default as data } from "../schemas/sample_data";
import { createSearchResultsView } from "../middlewares/results_builder";
import { searchMetadata } from "../middlewares/parseResults";
import axios from 'axios';


//static components of view
let staticView = {
  type: "modal",
  title: {
    type: "plain_text",
    text: "Search Results  :ocean:",
    emoji: true
  },
  close: {
    type: "plain_text",
    text: "Cancel",
    emoji: true
  }
};


export default async function getSearchResults(searchQuery) {
  let resp = await axios(`https://aquarius.commons.oceanprotocol.com/api/v1/aquarius/assets/ddo/query?text=${searchQuery}`)

  let { results } = resp.data;
  //console.log(results)
  let data = await Promise.all(results.map(r => {
    let metadata = searchMetadata(r.service);
    let res = metadata.attributes.main;
    res.title = metadata.attributes.main.name;
    res.id = r.id;
    return res;
  }))

  return await createSearchResultsView(staticView, data);
}



