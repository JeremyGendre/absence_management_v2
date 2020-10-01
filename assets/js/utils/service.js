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

/**
 * Allow to replace an old service value with the new
 * @param services
 * @param service
 * @returns {*}
 */
export function editServiceInList(services,service)
{
    for(let i = 0; i < services.length; i++){
        if(services[i].id === service.id){
            services[i] = service;
            break;
        }
    }
    return services;
}