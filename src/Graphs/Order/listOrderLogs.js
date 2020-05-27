import { callApiToServer } from '../callApi';

export async function getAllOrderLogs(authtoken, orderId) {
  try {
    console.log("!!!!!!!!!!!!!", authtoken, orderId);

    let body = JSON.stringify({
        orderId: orderId,
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/all-user-logs-orderId");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
