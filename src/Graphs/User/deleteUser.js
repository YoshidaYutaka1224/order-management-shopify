import { callApiToServer } from '../callApi';

export async function deleteUser(
  authtoken,
  userId,
  skipNumber,
  limitNumber,
  searchText
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        search_text : searchText
    });
  
    let endUrl = "v1/auth/delete-user/" + userId + "/" + skipNumber + "/" + limitNumber;
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);

    return responseData;
      
  }catch(err) {
    throw err;
  }
}
