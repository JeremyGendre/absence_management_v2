<?php


namespace App\Service\Validator;


use App\Entity\User;
use App\Repository\ServiceRepository;
use App\Repository\UserRepository;

class UserValidator implements MyValidatorInterface
{
    /**
     * @var ServiceRepository
     */
    private $serviceRepository;
    /**
     * @var UserRepository
     */
    private $userRepository;

    /**
     * UserValidator constructor.
     * @param ServiceRepository $serviceRepository
     * @param UserRepository $userRepository
     */
    public function __construct(ServiceRepository $serviceRepository, UserRepository $userRepository)
    {
        $this->serviceRepository = $serviceRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @param array|null $data
     * @return bool
     */
    public static function validate(?array $data): bool
    {
        return (
            !empty($data) &&
            self::checkFieldsPresence($data) &&
            self::checkFieldTypes($data) &&
            self::checkFieldValues($data)
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldsPresence(array $data): bool
    {
        return (
            array_key_exists("first_name",$data) && !empty($data['first_name']) &&
            array_key_exists("last_name",$data) && !empty($data['last_name']) &&
            array_key_exists("email",$data) && !empty($data['email']) &&
            array_key_exists("username",$data) && !empty($data['username']) &&
            array_key_exists("title",$data) && !empty($data['title']) &&
            array_key_exists("service",$data) && !empty($data['service'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldTypes(array $data): bool
    {
        return (
            is_string($data['first_name']) &&
            is_string($data['last_name']) &&
            is_string($data['email']) &&
            is_string($data['username']) &&
            is_string($data['title']) &&
            is_int($data['service'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldValues(array $data): bool
    {
        return (
            strlen($data['first_name']) < 100 &&
            strlen($data['last_name']) < 100 &&
            strlen($data['email']) < 100 && filter_var($data['email'],FILTER_VALIDATE_EMAIL) &&
            strlen($data['username']) < 20 &&
            strlen($data['title']) < 255
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkPassword(array $data): bool
    {
        $password = $data['password'];
        return (
            !empty($password) &&
            is_string($password) &&
            strlen($password) < 100 && strlen($password) > 6
        );
    }

    /**
     * @param array $data
     * @return string|null
     */
    public static function changePasswordFormError(array $data)
    {
        if(empty($data)){
            return 'Les données envoyées sont vides, impossible de modifier le mot de passe';
        }
        elseif(empty($data['oldPassword'])){
            return "L'ancien mot de passe n'est pas valide.";
        }
        elseif(empty($data['password']) || !self::checkPassword($data)){
            return "Le nouveau mot de passe n'est pas valide (au moins 6 charactères)";
        }
        return null;
    }

    /**
     * @param string $username
     * @return bool
     */
    public function checkUsername(string $username): bool
    {
        $usersByUsername = $this->userRepository->findBy(['username' => $username]);
        return count($usersByUsername) === 0;
    }

    /**
     * @param array $data
     * @return bool
     */
    public function checkServiceExistence(array $data): bool
    {
        return $this->serviceRepository->findOneBy(['id' => $data['service']]) !== null;
    }

    /**
     * @param string $username
     * @param User $user
     * @return bool
     */
    public function checkUsernameWithExistingUser(string $username, User $user): bool
    {
        $usersByUsername = $this->userRepository->findBy(['username' => $username]);
        $numberResults = count($usersByUsername);
        if($numberResults > 0){
            if($numberResults === 1){
                if($usersByUsername[0] === $user){
                    return true;
                }
            }
            return false;
        }
        return true;
    }
}