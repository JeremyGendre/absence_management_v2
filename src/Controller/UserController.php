<?php


namespace App\Controller;


use App\Entity\Service;
use App\Entity\User;
use App\Repository\ServiceRepository;
use App\Repository\UserRepository;
use App\Service\ErrorHandler;
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
     */
    public function getAllUsers(
        UserRepository $userRepository
    ):JsonResponse{
        $users = $userRepository->findAll();
        $response = [];
        foreach ($users as $user){
            $response[] = $user->serialize();
        }
        return new JsonResponse($response);
    }

    /**
     * @Route("/auth", name="get_authenticated_user", methods={"GET"})
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
     * @param ErrorHandler $errorHandler
     * @return JsonResponse
     */
    public function getOneUserByUsername(
        string $username,
        UserRepository $userRepository,
        ErrorHandler $errorHandler
    ):JsonResponse{
        $user = $userRepository->findOneBy([
            "username" => $username
        ]);
        if($user === null){
            return $errorHandler->jsonResponseError("Aucun utilisateur trouvé avec le nom '".$username."'.");
        }
        return new JsonResponse($user->serialize());
    }

    /**
     * @Route(path="/new", name="user_new", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     * @param Request $request
     * @param ErrorHandler $errorHandler
     * @param UserValidator $userValidator
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ServiceRepository $serviceRepository
     * @return JsonResponse
     */
    public function postUser(
        Request $request,
        ErrorHandler $errorHandler,
        UserValidator $userValidator,
        UserPasswordEncoderInterface $passwordEncoder,
        ServiceRepository $serviceRepository
    ):JsonResponse{
        $data = json_decode($request->getContent(),true);
        if(!$userValidator->validate($data) || empty($data['password']) || !$userValidator->checkPassword($data['password'])){
            return $errorHandler->jsonResponseError("Les données envoyées ne sont pas valides");
        }
        $user = new User();
        $user->setPassword($passwordEncoder->encodePassword($user,$data['password']));
        $user->setUsername($data['username']);
        $user->setFirstName($data['first_name']);
        $user->setLastName($data['last_name']);
        $user->setEmail($data['email']);
        $user->setTitle($data['title']);
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
     */
    public function deleteUser(
        User $user
    ):JsonResponse{
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
     * @param ErrorHandler $errorHandler
     * @param UserValidator $userValidator
     * @param ServiceRepository $serviceRepository
     * @return JsonResponse
     */
    public function editUser(
        User $user,
        Request $request,
        ErrorHandler $errorHandler,
        UserValidator $userValidator,
        ServiceRepository $serviceRepository
    ):JsonResponse{
        /** @var User $authUser */
        $authUser = $this->getUser();
        if($authUser->getUsername() !== $user->getUsername() && !$authUser->hasRole("ROLE_ADMIN")){
            return $errorHandler->jsonResponseError("La personne authentifiée n'est pas la même que celle modifiée ou n'a pas les droits nécessaires.");
        }
        $data = json_decode($request->getContent(),true);
        if(!$userValidator->validate($data)){
            return $errorHandler->jsonResponseError("Les données envoyées ne sont pas valides");
        }

        if($data['username'] !== $user->getUsername()){
            $usernameUser = $this->getDoctrine()->getRepository(User::class)->findOneBy(["username"=>$data['username']]);
            if($usernameUser !== null){
                return $errorHandler->jsonResponseError("Le nom d'utilisateur existe déjà.");
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
     * @Route(path="/edit/password/{id}", name="user_edit_password", methods={"PUT"})
     * @param User $user
     * @param Request $request
     * @param ErrorHandler $errorHandler
     * @param UserValidator $userValidator
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @return JsonResponse
     */
    public function editUserPassword(
        User $user,
        Request $request,
        ErrorHandler $errorHandler,
        UserValidator $userValidator,
        UserPasswordEncoderInterface $passwordEncoder
    ):JsonResponse{
        if($this->getUser() !== $user){
            return $errorHandler->jsonResponseError("Vous ne pouvez pas modifier le mot de passe d'une autre personne");
        }
        $data = json_decode($request->getContent(),true);
        $formError = $userValidator->changePasswordFromError($data);
        if($formError !== null){
            return $errorHandler->jsonResponseError($formError);
        }
        if(!$passwordEncoder->isPasswordValid($user, $data['oldPassword'])){
            return $errorHandler->jsonResponseError("L'ancien mot de passe ne correspond pas. Veuillez réessayer");
        }
        $user->setPassword($passwordEncoder->encodePassword($user,$data['password']));
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();
        return new JsonResponse($user->serialize());
    }
}