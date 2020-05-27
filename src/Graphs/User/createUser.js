import { callApiToServer } from '../callApi';

export async function createUser(
  authtoken,
  userObject,
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        username: userObject.username,
        role: userObject.role,
        email: userObject.email,
        // phone: userObject.phone,
        first_name : userObject.first_name,
        last_name : userObject.last_name,
        password: userObject.password,
    });
  
    let endUrl = "v1/auth/create-user";
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);
      
    return responseData;
      
  }catch(err) {
    throw err;
  }
}
