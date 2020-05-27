import { callApiToServer } from '../callApi';

export async function editTag(
  authtoken,
  tagObject,
  tagId,
) {
  try{
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "authorization" : "Berear " + authtoken
    };
      
    let body = JSON.stringify({
        tagId: tagId,
        name: tagObject.name,
        description: tagObject.description,
        text_color: tagObject.text_color,
        background_color: tagObject.background_color,
    });
  
    let endUrl = "v1/auth/edit-tag";
    console.log("endUrl printed here", endUrl);
  
    let responseData = await callApiToServer(body, header, "POST", endUrl);
      
    return responseData;
      
  }catch(err) {
    throw err;
  }
}
