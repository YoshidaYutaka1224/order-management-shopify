import { callApiToServer } from '../callApi';

export async function getAllUserLogs(authtoken, userId) {
  try {
    console.log("!!!!!!!!!!!!!", authtoken, userId);

    let body = JSON.stringify({
        userId: userId,
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/all-user-logs-userId");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
