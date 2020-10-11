/**
 * Remove an element from an array
 * @param needle
 * @param array
 * @returns {[]}
 */
export function removeFromArray(needle,array)
{
    let newArray = [];
    array.forEach((value)=>{
        if(value !== needle){
            newArray.push(value);
        }
    });
    return newArray;
}

/**
 * Check if the given variable is dividable by the given divider
 * @param variable
 * @param divider
 * @returns {boolean}
 */
export function isDividableBy(variable, divider)
{
    if(typeof variable !== "number"){
        try{
            variable = parseInt(variable);
        }catch(e){
            console.error(e);
            return false;
        }
    }
    return variable % divider === 0;
}

/**
 * Makes an object usable with semantic-ui's Select component
 * @param key
 * @param value
 * @param text
 * @returns {{text: *, value: *, key: *}}
 */
export function objectToSelectable(key,value,text)
{
    return {
        key:key,
        value:value,
        text:text,
    };
}

/**
 * Makes an array (of non-objects) usable with semantic-ui's Select component
 * @param haystack
 * @returns {[]}
 */
export function collectionOfSelectableObjects(haystack)
{
    let returnedArray = [];
    haystack.map((value,index) => {
        returnedArray.push(objectToSelectable(index, value, value));
    });
    return returnedArray;
}

/**
 * Return the first {number} items in {list} beginning at offset {start}
 * @param list
 * @param start
 * @param number
 * @returns {[]}
 */
export function getFirstItemsInList(list, start, number){
    let result = [];
    for(let i = start; i < (start + number); i++){
        if(list[i] !== undefined){
            result.push(list[i]);
        }
    }
    return result;
}