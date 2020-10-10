<?php

namespace App\Controller;

use App\Entity\History;
use App\Entity\Service;
use App\Entity\User;
use App\Repository\ServiceRepository;
use App\Repository\UserRepository;
use App\Service\Handler\ResponseHandler;
use App\Service\Helper\HistoryHelper;
use App\Service\Helper\RoleHelper;
use App\Service\Serializer\MySerializer;
use App\Service\Validator\UserValidator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route(path="/api/user")
 * Class UserController
 * @package App\Controller
 */
class UserController extends AbstractController
{
    /**
     * @Route(path="/all", name="users_all", methods={"GET"})
     * @param UserRepository $userRepository
     * @return JsonResponse
     * @throws \Exception
     */
    public function getAllUsers(
        UserRepository $userRepository
    ):JsonResponse{
        $users = $userRepository->findBy([],['isActive' => 'DESC','lastName' => 'ASC']);
        $response = MySerializer::serializeMany($users);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/auth", name="get_authenticated_user", methods={"GET"})
     * @return JsonResponse
     * @throws \Exception
     */
    public function getAuthUser():JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if($user->getIsActive() === false){
            throw new \Exception("The user account has been deactivated");
        }
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/{id}", name="user_one", methods={"GET"})
     * @param User $user
     * @return JsonResponse
     */
    public function getOneUser(
        User $user
    ):JsonResponse{
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/username/{username}", name="user_one_by_username", methods={"GET"})
     * @param string $username
     * @param UserRepository $userRepository
     * @return JsonResponse
     * @throws \Exception
     */
    public function getOneUserByUsername(
        string $username,
        UserRepository $userRepository
    ):JsonResponse{
        $user = $userRepository->findOneBy([
            "username" => $username
        ]);
        if($user === null){
            return ResponseHandler::errorResponse("Aucun utilisateur trouvé avec le nom '".$username."'.");
        }
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/new", name="user_new", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     * @param Request $request
     * @param UserValidator $userValidator
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ServiceRepository $serviceRepository
     * @return JsonResponse
     * @throws \Exception
     */
    public function postUser(
        Request $request,
        UserValidator $userValidator,
        UserPasswordEncoderInterface $passwordEncoder,
        ServiceRepository $serviceRepository
    ):JsonResponse{
        $data = json_decode($request->getContent(),true);
        if(!UserValidator::validate($data) || !$userValidator->checkServiceExistence($data) || !UserValidator::checkPassword($data)){
            return ResponseHandler::errorResponse("Les données envoyées ne sont pas valides");
        }
        $user = new User();
        if(!$userValidator->checkUsername($data['username'])){
            return ResponseHandler::errorResponse("Le nom d'utilisateur existe déjà");
        }
        $user->setUsername($data['username']);
        $user->setPassword($passwordEncoder->encodePassword($user,$data['password']));
        $user->setFirstName($data['first_name']);
        $user->setLastName($data['last_name']);
        $user->setEmail($data['email']);
        $user->setTitle($data['title']);
        $user->setRoles([RoleHelper::ROLE_USER]);
        /** @var Service $service */
        $service = $serviceRepository->findOneBy(['id' => $data['service']]);
        $user->setService($service);

        /** @var History $userHistory */
        $userHistory = HistoryHelper::historize($user, $this->getUser()->getId(),History::TYPE_CREATE);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->persist($userHistory);
        $em->flush();
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/delete/{id}", name="user_delete", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN")
     * @param User $user
     * @return JsonResponse
     * @throws \Exception
     */
    public function deleteUser(
        User $user
    ):JsonResponse{
        /** @var User $authUser */
        $authUser = $this->getUser();
        if($authUser === $user){
            return ResponseHandler::errorResponse("Vous ne pouvez pas vous supprimer vous-même");
        }
        if(RoleHelper::userIsSuperAdmin($user) || (RoleHelper::userHasRole($user,RoleHelper::ROLE_ADMIN) && !RoleHelper::userIsSuperAdmin($authUser))){
            return ResponseHandler::errorResponse("Vous n'avez pas les droits nécessaires");
        }

        /** @var History $userHistory */
        $userHistory = HistoryHelper::historize($user, $authUser->getId(),History::TYPE_DELETE);

        $em = $this->getDoctrine()->getManager();
        $em->persist($userHistory);
        $em->remove($user);
        $em->flush();
        return ResponseHandler::successResponse("Utilisateur supprimé");
    }

    /**
     * @Route(path="/edit/{id}", name="user_edit", methods={"PUT"})
     * @param User $user
     * @param Request $request
     * @param ServiceRepository $serviceRepository
     * @return JsonResponse
     * @throws \Exception
     */
    public function editUser(
        User $user,
        Request $request,
        ServiceRepository $serviceRepository
    ):JsonResponse{
        /** @var User $authUser */
        $authUser = $this->getUser();
        if($user->isAdmin() && $user !== $authUser){
            return ResponseHandler::errorResponse("Vous ne pouvez pas modifier un autre administrateur.");
        }
        if(!$authUser->isAdmin() && $authUser !== $user){
            return ResponseHandler::errorResponse("La personne authentifiée n'est pas la même que celle modifiée ou n'a pas les droits nécessaires.");
        }
        $data = json_decode($request->getContent(),true);
        if(!UserValidator::validate($data)){
            return ResponseHandler::errorResponse("Les données envoyées ne sont pas valides");
        }

        if($data['username'] !== $user->getUsername()){
            $usernameUser = $this->getDoctrine()->getRepository(User::class)->findOneBy(["username"=>$data['username']]);
            if($usernameUser !== null){
                return ResponseHandler::errorResponse("Le nom d'utilisateur existe déjà.");
            }
            $user->setUsername($data['username']);
        }
        if($data['first_name'] !== $user->getFirstName()){$user->setFirstName($data['first_name']);}
        if($data['last_name'] !== $user->getLastName()){$user->setLastName($data['last_name']);}
        if($data['email'] !== $user->getEmail()){$user->setEmail($data['email']);}
        if($data['title'] !== $user->getTitle()){$user->setTitle($data['title']);}
        if($data['service'] !== $user->getService()->getId()){
            /** @var Service $service */
            $service = $serviceRepository->findOneBy(['id' => $data['service']]);
            $user->setService($service);
        }

        /** @var History $userHistory */
        $userHistory = HistoryHelper::historize($user, $this->getUser()->getId(),History::TYPE_EDIT);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->persist($userHistory);
        $em->flush();

        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/edit/roles/{id}", name="user_edit_roles", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN")
     * @param User $user
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function editUserRoles(User $user, Request $request):JsonResponse{
        /** @var User $authUser */
        $authUser = $this->getUser();
        if(RoleHelper::hasBadRolesForRoleEdition($user,$authUser)) {
            return ResponseHandler::errorResponse("Vous n'avez pas les droits nécessaires");
        }

        $data = json_decode($request->getContent(),true);
        if(array_key_exists('roles',$data) === false){
            return ResponseHandler::errorResponse("Le format de données n'est pas correct");
        }

        $roles = $data['roles'];
        RoleHelper::validateRoles($roles);
        $user->setRoles($roles);

        /** @var History $userHistory */
        $userHistory = HistoryHelper::historize($user, $this->getUser()->getId(),History::TYPE_EDIT);

        $manager = $this->getDoctrine()->getManager();
        $manager->persist($user);
        $manager->persist($userHistory);
        $manager->flush();
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/edit/password/{id}", name="user_edit_password", methods={"PUT"})
     * @param User $user
     * @param Request $request
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @return JsonResponse
     * @throws \Exception
     */
    public function editUserPassword(
        User $user,
        Request $request,
        UserPasswordEncoderInterface $passwordEncoder
    ):JsonResponse{
        if($this->getUser() !== $user){
            return ResponseHandler::errorResponse("Vous ne pouvez pas modifier le mot de passe d'une autre personne");
        }
        $data = json_decode($request->getContent(),true);
        $formError = UserValidator::changePasswordFormError($data);
        if($formError !== null){
            return ResponseHandler::errorResponse($formError);
        }
        if(!$passwordEncoder->isPasswordValid($user, $data['oldPassword'])){
            return ResponseHandler::errorResponse("L'ancien mot de passe ne correspond pas.");
        }
        $user->setPassword($passwordEncoder->encodePassword($user,$data['password']));

        /** @var History $userHistory */
        $userHistory = HistoryHelper::historize($user, $this->getUser()->getId(),History::TYPE_EDIT);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->persist($userHistory);
        $em->flush();
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/activation/{id}", name="user_activation", methods={"PUT"})
     * @param User $user
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function toggleUserActivation(User $user, Request $request):JsonResponse
    {
        /** @var User $authUser */
        $authUser = $this->getUser();
        if($authUser === $user){
            return ResponseHandler::errorResponse("Vous ne pouvez pas gérer votre activation/désactivation");
        }
        if(RoleHelper::userIsSuperAdmin($user) || (RoleHelper::userHasRole($user,RoleHelper::ROLE_ADMIN) && !RoleHelper::userIsSuperAdmin($authUser))){
            return ResponseHandler::errorResponse("Vous n'avez pas les droits nécessaires");
        }
        $data = json_decode($request->getContent(),true);
        if(array_key_exists('isActive',$data) === false || ($data['isActive'] !== false && $data['isActive'] !== true)){
            return ResponseHandler::errorResponse("Les données envoyées ne sont pas valides");
        }
        $user->setIsActive($data['isActive']);

        /** @var History $userHistory */
        $userHistory = HistoryHelper::historize($user, $authUser->getId(),History::TYPE_EDIT);

        $em = $this->getDoctrine()->getManager();
        $em->persist($userHistory);
        $em->persist($user);
        $em->flush();
        return new JsonResponse($user->serialize());
    }
}