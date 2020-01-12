import { createSearchResultsView } from "../middlewares/results_builder";
import { searchMetadata } from "../middlewares/parseResults";
import axios from 'axios';

var searchResults = [];

async function getWalletData(userId, results) {
  let dataForWallet = await Promise.all(results.map(res => {
    let metadata = searchMetadata(res.service);
    if (metadata.attributes.additionalInformation) {
      let publisher = metadata.attributes.additionalInformation.publisher;
      if (publisher == userId) {
        return res;
      }
    }
  }))
  return dataForWallet;
}




export default async function getSearchResults(searchQuery, page, isDataWallet = false) {
  if (!page && searchQuery) {
    let resp = await axios(`https://aquarius.commons.oceanprotocol.com/api/v1/aquarius/assets/ddo/query?text=${searchQuery}&offset=500`)
    if (isDataWallet) {
      searchResults = await getWalletData(searchQuery, resp.data.results);
    } else {
      searchResults = resp.data.results;
    }
    page = 1;
  }

  let totalResults = searchResults.length;
  let totalPages = totalResults > 20 ? totalResults / 20 : 1;
  let pageResults = [];
  console.log(`Total results - ${searchResults.length}`);
  console.log(`Total pages - ${totalPages}`);
  if (searchResults.length >= 100) {
    pageResults = searchResults.slice((page - 1) * 20, 20 * page);
    console.log(`Page ${page} : Results truncated to ${pageResults.length} results`)
  } else {
    pageResults = [...searchResults];
  }

  let data = await Promise.all(pageResults.map(r => {
    let metadata = searchMetadata(r.service);
    let res = metadata.attributes.main;
    res.title = metadata.attributes.main.name;
    res.id = r.id;
    return res;
  }))

  return await createSearchResultsView(data, totalResults, totalPages, page, isDataWallet);
}
