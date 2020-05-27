import { callApiToServer } from '../callApi';

export async function updateTag(authtoken, orderIdArray, tagArray, fulfillProductArray) {
  try {
    console.log("!!!!!!!!!!!!!", authtoken, orderIdArray, tagArray, fulfillProductArray);

    let body = JSON.stringify({
        orderIdArray: orderIdArray,
        tagArray: tagArray,
        fulfillProductArray: fulfillProductArray
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/update-order-tag");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
