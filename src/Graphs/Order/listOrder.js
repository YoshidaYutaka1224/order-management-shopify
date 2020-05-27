import { callApiToServer } from '../callApi';

export async function getAllOrder(authtoken, limitNumber) {
  try {

    let body = JSON.stringify({
      limitNumber: limitNumber,
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/get-order-data");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
