import { callApiToServer } from '../callApi';

export async function getAllFilterOrder(authtoken, limitNumber, tagArray) {
  try {

    let body = JSON.stringify({
      limitNumber: limitNumber,
      tagArray: tagArray
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/get-filter-order-data");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
