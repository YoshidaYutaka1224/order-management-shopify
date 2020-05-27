import { callGetApiToServer } from '../callApi';

export async function callAllKpis(authToken) {
  try {
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Bearer " + authToken
    }

    let endUrl = "v1/auth/all-kpis";
    let responseData = await callGetApiToServer(header, "GET", endUrl);
    
    return responseData;
  }catch(error){
    throw error;
  }
}
