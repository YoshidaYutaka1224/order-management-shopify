import { callGetApiToServer } from '../../callApi';

export async function getAllFilter(
  authtoken,
  skipNumber,
  limitNumber
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }
  
    let endUrl = "v1/auth/list-filter/" + skipNumber + "/" + limitNumber;
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callGetApiToServer(header, "GET", endUrl);
      
    return responseData;
  }catch(err) {
    throw err;
  }
}
