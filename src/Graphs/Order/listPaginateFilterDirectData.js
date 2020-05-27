import { callApiToServer } from '../callApi';

export async function getAllFilterPaginateDirectOrder(authtoken, limitNumber, cursorData, queryString) {
  try {

    let body = JSON.stringify({
      limitNumber: limitNumber,
      cursorData: cursorData,
      queryString: queryString 
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/get-filter-order-direct-query-paginate-data");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
