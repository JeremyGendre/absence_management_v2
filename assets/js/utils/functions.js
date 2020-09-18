export function removeFromArray(needle,array){
    let newArray = [];
    array.forEach((value)=>{
        if(value !== needle){
            newArray.push(value);
        }
    });
    return newArray;
}