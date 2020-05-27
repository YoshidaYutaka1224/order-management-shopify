import { callApiToServer } from '../callApi';

export async function getAllPaginateOrder(authtoken, limitNumber, cursorData) {
  try {

    let body = JSON.stringify({
      limitNumber: limitNumber,
      cursorData: cursorData
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/get-order-paginate-data");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
