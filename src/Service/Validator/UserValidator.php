<?php


namespace App\Service\Validator;


use App\Repository\ServiceRepository;

class UserValidator implements MyValidatorInterface
{
    /**
     * @var ServiceRepository
     */
    private $serviceRepository;

    /**
     * UserValidator constructor.
     * @param ServiceRepository $serviceRepository
     */
    public function __construct(ServiceRepository $serviceRepository)
    {
        $this->serviceRepository = $serviceRepository;
    }

    /**
     * @param array|null $data
     * @return bool
     */
    function validate(?array $data): bool
    {
        return (
            !empty($data) &&
            $this->checkFieldsPresence($data) &&
            $this->checkFieldTypes($data) &&
            $this->checkFieldValues($data)
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    function checkFieldsPresence(array $data): bool
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
    function checkFieldTypes(array $data): bool
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
    function checkFieldValues(array $data): bool
    {
        return (
            strlen($data['first_name']) < 100 &&
            strlen($data['last_name']) < 100 &&
            strlen($data['email']) < 100 && filter_var($data['email'],FILTER_VALIDATE_EMAIL) &&
            strlen($data['username']) < 20 &&
            strlen($data['title']) < 255 &&
            ($this->serviceRepository->findOneBy(['id' => $data['service']]) !== null)
        );
    }

    /**
     * @param $password
     * @return bool
     */
    function checkPassword($password)
    {
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
    function changePasswordFromError(array $data)
    {
        if(empty($data)){
            return 'Les données envoyées sont vides, impossible de modifier le mot de passe';
        }
        elseif(empty($data['oldPassword'])){
            return "L'ancien mot de passe n'est pas valide.";
        }
        elseif(empty($data['password']) || !$this->checkPassword($data['password'])){
            return "Le nouveau mot de passe n'est pas valide (au moins 6 charactères)";
        }
        return null;
    }
}