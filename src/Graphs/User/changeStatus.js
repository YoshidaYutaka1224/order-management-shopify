import { callApiToServer } from '../callApi';

export async function changeStatus(
  authtoken,
  userId,
  status
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        userId: userId,
        flag: status
    });

    let endUrl = "v1/auth/change-user-status";
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);
      
    return responseData;
  }catch(err) {
    throw err;
  }
}
