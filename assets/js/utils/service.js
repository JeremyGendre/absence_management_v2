import {objectToSelectable} from "./functions";

/**
 * Make an array of services usable in Semantic-ui's Select component
 * @param services
 * @returns {[]}
 */
export function servicesToSelectable(services)
{
    let newServiceList = [];
    services.forEach(service => {
        newServiceList.push(objectToSelectable(service.id,service.id,service.name));
    });
    return newServiceList;
}