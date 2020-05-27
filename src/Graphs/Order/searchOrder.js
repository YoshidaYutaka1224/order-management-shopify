import { callApiToServer } from '../callApi';

export async function searchOrder(authtoken, searchString) {
  try {
    console.log("!!!!!!!!!!!!!", authtoken, searchString);

    let body = JSON.stringify({
        searchString: searchString,
    });

    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    }

    let responseData = await callApiToServer(body, header, "POST", "v1/auth/search-order");
    
    return responseData;
  }catch(error){
    throw error;
  }
}
