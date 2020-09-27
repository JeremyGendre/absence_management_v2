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
        if(!in_array($role,self::ROLES)){
            return false;
        }
        return $user->hasRole($role);
    }

    /**
     * @param User $user
     * @return bool
     */
    public function userIsAdmin(User $user): bool
    {
        return $user->isAdmin();
    }
}