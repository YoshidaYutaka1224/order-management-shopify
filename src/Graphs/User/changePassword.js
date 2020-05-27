import { callApiToServer } from '../callApi';

export async function changePassword(
  authtoken,
  userObject,
  userId
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        userId: userId,
        password: userObject.password
    });

    let endUrl = "v1/auth/change-user-password";
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);
      
    return responseData;
  }catch(err) {
    throw err;
  }
}
