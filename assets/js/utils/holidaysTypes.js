export const TYPE_CP = 1;
export const TYPE_CT = 2;
export const TYPE_AM = 3;

export const TYPES_LABEL = {
    TYPE_CP : {
        short : "CP",
        long : "Congés Payés"
    },
    TYPE_CT : {
        short : "CT",
        long : "Crédit Temps"
    },
    TYPE_AM : {
        short : "AM",
        long : "Arrêt Maladie"
    }
};

export function getShortType(type){
    let result = 'Inconnu';
    switch(type){
        case TYPE_CP:
            result = TYPES_LABEL.TYPE_CP.short;
            break;
        case TYPE_CT:
            result = TYPES_LABEL.TYPE_CT.short;
            break;
        case TYPE_AM:
            result = TYPES_LABEL.TYPE_AM.short;
            break;
        default:
            break;
    }
    return result;
}