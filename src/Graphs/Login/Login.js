import { callApiToServer } from '../callApi';

export async function callLogin(email, password) {
  console.log("in about to call adminLogin", email, password);
  try {

    let body = JSON.stringify({
      email: email,
      password: password
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/admin-login");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
