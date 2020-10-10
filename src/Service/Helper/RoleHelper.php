<?php

namespace App\Service\Helper;

use App\Entity\User;

class RoleHelper
{
    public const ROLE_USER = "ROLE_USER";
    public const ROLE_ADMIN = "ROLE_ADMIN";
    public const ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";

    public const ROLES = [
        self::ROLE_USER,
        self::ROLE_ADMIN,
        self::ROLE_SUPER_ADMIN,
    ];

    /**
     * @param User $user
     * @param string $role
     * @return bool
     */
    public static function userHasRole(User $user, string $role): bool
    {
        if(!self::roleExists($role)){
            return false;
        }
        return $user->hasRole($role);
    }

    /**
     * @param User $user
     * @return bool
     */
    public static function userIsAdmin(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * @param User $user
     * @return bool
     */
    public static function userIsSuperAdmin(User $user):bool
    {
        return self::userHasRole($user,self::ROLE_SUPER_ADMIN);
    }

    /**
     * @param string $role
     * @return bool
     */
    public static function roleExists(string $role): bool
    {
        return in_array($role,self::ROLES);
    }

    /**
     * @param array $roles
     * @return bool
     */
    public static function rolesExists(array $roles): bool
    {
        foreach ($roles as $role){
            if(self::roleExists($role) === false){
                return false;
            }
        }
        return true;
    }

    /**
     * @param $roles
     * @throws \Exception
     */
    public static function validateRoles($roles){
        if(is_array($roles) === false){
            throw new \Exception("Le format des rôles n'est pas le bon (un tableau de valeurs es requis)");
        }
        if(RoleHelper::rolesExists($roles) === false){
            throw new \Exception("Un ou plusieurs rôle(s) soumis n'existe(nt) pas");
        }
    }

    /**
     * @param User $user
     * @param User $authUser
     * @return bool
     */
    public static function hasBadRolesForRoleEdition(User $user, User $authUser):bool
    {
        return (self::userIsSuperAdmin($user) && !self::userIsSuperAdmin($authUser)) || ($authUser === $user) ||
            ((!self::userIsSuperAdmin($user) && self::userHasRole($user,self::ROLE_ADMIN)) && !self::userIsSuperAdmin($authUser));
    }
}