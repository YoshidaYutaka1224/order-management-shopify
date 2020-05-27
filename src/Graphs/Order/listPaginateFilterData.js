import { callApiToServer } from '../callApi';

export async function getAllFilterPaginateOrder(authtoken, limitNumber, cursorData, tagArray) {
  try {

    let body = JSON.stringify({
      limitNumber: limitNumber,
      cursorData: cursorData,
      tagArray: tagArray 
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/get-filter-order-paginate-data");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
