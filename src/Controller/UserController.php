<?php

namespace App\Controller;

use App\Entity\Service;
use App\Entity\User;
use App\Repository\ServiceRepository;
use App\Repository\UserRepository;
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
        $users = $userRepository->findAll();
        $response = MySerializer::serializeMany($users);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/all/{id}", name="users_all_by_service", methods={"GET"})
     * @param Service $service
     * @return JsonResponse
     * @throws \Exception
     */
    public function getUsersByService(
        Service $service
    ):JsonResponse{
        $users = $service->getUsers();
        $response = MySerializer::serializeMany($users);
        return new JsonResponse();
    }

    /**
     * @Route(path="/auth", name="get_authenticated_user", methods={"GET"})
     * @return JsonResponse
     */
    public function getAuthUser():JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
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
            throw new \Exception("Aucun utilisateur trouvé avec le nom '".$username."'.");
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
        if(!UserValidator::validate($data) || $userValidator->checkServiceExistence($data) || !UserValidator::checkPassword($data)){
            throw new \Exception("Les données envoyées ne sont pas valides");
        }
        $user = new User();
        if(!$userValidator->checkUsername($data['username'])){
            throw new \Exception("Le nom d'utilisateur existe déjà");
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
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
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
        if($this->getUser() === $user){
            throw new \Exception("Vous ne pouvez pas vous supprimer vous-même");
        }
        if($user->isAdmin()){
            throw new \Exception("Vous ne pouvez pas supprimer un administrateur");
        }
        $em = $this->getDoctrine()->getManager();
        $em->remove($user);
        $em->flush();
        return new JsonResponse([
            "success" => true,
            "message" => "Utilisateur supprimé"
        ]);
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
            throw new \Exception("Vous ne pouvez pas modifier un autre administrateur.");
        }
        if(!$authUser->isAdmin() && $authUser !== $user){
            throw new \Exception("La personne authentifiée n'est pas la même que celle modifiée ou n'a pas les droits nécessaires.");
        }
        $data = json_decode($request->getContent(),true);
        if(!UserValidator::validate($data)){
            throw new \Exception("Les données envoyées ne sont pas valides");
        }

        if($data['username'] !== $user->getUsername()){
            $usernameUser = $this->getDoctrine()->getRepository(User::class)->findOneBy(["username"=>$data['username']]);
            if($usernameUser !== null){
                throw new \Exception("Le nom d'utilisateur existe déjà.");
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
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
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
        $data = json_decode($request->getContent(),true);
        if(array_key_exists('roles',$data) === false){
            throw new \Exception("Le format de données n'est pas correct");
        }

        $roles = $data['roles'];
        RoleHelper::validateRoles($roles);
        $user->setRoles($roles);

        $manager = $this->getDoctrine()->getManager();
        $manager->persist($user);
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
            throw new \Exception("Vous ne pouvez pas modifier le mot de passe d'une autre personne");
        }
        $data = json_decode($request->getContent(),true);
        $formError = UserValidator::changePasswordFormError($data);
        if($formError !== null){
            throw new \Exception($formError);
        }
        if(!$passwordEncoder->isPasswordValid($user, $data['oldPassword'])){
            throw new \Exception("L'ancien mot de passe ne correspond pas.");
        }
        $user->setPassword($passwordEncoder->encodePassword($user,$data['password']));
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();
        return new JsonResponse($user->serialize());
    }
}