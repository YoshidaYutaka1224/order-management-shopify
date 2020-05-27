import { callApiToServer } from '../callApi';

export async function getAllFilterDirectOrder(authtoken, limitNumber, queryString) {
  try {

    let body = JSON.stringify({
      limitNumber: limitNumber,
      queryString: queryString
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/get-filter-order-direct-query-data");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
