import { callApiToServer } from '../../callApi';

export async function addFilter(
  authtoken,
  filterObject,
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        tagArray: filterObject.tag,
        name: filterObject.name,
        filter_type: filterObject.filter_type,
        shopify_filter: filterObject.shopify_filter
    });
  
    let endUrl = "v1/auth/add-filter";
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);
      
    return responseData;
      
  }catch(err) {
    throw err;
  }
}
