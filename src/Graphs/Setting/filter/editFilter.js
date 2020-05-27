import { callApiToServer } from '../../callApi';

export async function editFilter(
  authtoken,
  filterObject,
  filterId
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        filterId : filterId,
        tagArray: filterObject.tag,
        name: filterObject.name,
        filter_type: filterObject.filter_type,
        shopify_filter: filterObject.shopify_filter
    });
  
    let endUrl = "v1/auth/edit-filter";
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);
      
    return responseData;
      
  }catch(err) {
    throw err;
  }
}
