/*export function requestConfig(token){
    return {
        headers : { Authorization: `Bearer ${token}` }
    };
}*/

export function isBadResult(result){
    let textReturned = '';
    if((result.data.success !== undefined && (result.data.success === 'false' || result.data.success === false))){
        textReturned = "Une erreur est survenue";
        if(result.data.message !== undefined && result.data.message !== ''){
            textReturned = result.data.message;
        }
    }
    return textReturned;
}