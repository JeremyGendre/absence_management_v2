/*export function requestConfig(token){
    return {
        headers : { Authorization: `Bearer ${token}` }
    };
}*/

export function isBadResult(result){
    let errorMessage = '';
    if((result.data.success !== undefined && (result.data.success === 'false' || result.data.success === false))){
        errorMessage = "Une erreur est survenue";
        if(result.data.message !== undefined && result.data.message !== ''){
            errorMessage = result.data.message;
        }
    }
    return errorMessage;
}