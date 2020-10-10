/**
 * Check if the user has the given role
 * @param user
 * @param role
 * @returns {boolean}
 */
export function userHasRole(user,role)
{
    if(user === null || user.roles === undefined || Array.isArray(user.roles) === false){
        return false;
    }
    return user.roles.includes(role);
}

/**
 * Check if a user has the admin rights
 * @param user
 * @returns {boolean}
 */
export function userIsAdmin(user)
{
    return userHasRole(user,"ROLE_ADMIN") || userHasRole(user,"ROLE_SUPER_ADMIN");
}

/**
 * Check if the user is a super administrator
 * @param user
 * @returns {boolean}
 */
export function userIsSuperAdmin(user)
{
    return userHasRole(user,"ROLE_SUPER_ADMIN");
}

/**
 * Edit the user with the given roles
 * @param users
 * @param userId
 * @param roles
 * @returns {*}
 */
export function editUserRoleInList(users,userId,roles)
{
    for(let i = 0; i < users.length; i++){
        if(users[i].id === userId){
            users[i].roles = roles;
            break;
        }
    }
    return users;
}

/**
 * Fully edit a user in a user collection
 * @param users
 * @param user
 * @returns {*}
 */
export function editUserInList(users,user)
{
    for(let i = 0; i < users.length; i++){
        if(users[i].id === user.id){
            users[i] = user;
            break;
        }
    }
    return users;
}
