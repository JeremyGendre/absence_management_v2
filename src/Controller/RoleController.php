<?php


namespace App\Controller;


use App\Service\Helper\RoleHelper;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(path="/api/role")
 * Class RoleController
 * @package App\Controller
 */
class RoleController extends AbstractController
{
    /**
     * @Route(path="/all", name="all_roles", methods={"GET"})
     * @return JsonResponse
     */
    public function getAllRoles(){
        return new JsonResponse(RoleHelper::ROLES);
    }
}