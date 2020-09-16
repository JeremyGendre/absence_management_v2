<?php


namespace App\Service\Validator;


use App\Repository\ServiceRepository;

class UserValidator implements MyValidatorInterface
{

    private $serviceRepository;

    public function __construct(ServiceRepository $serviceRepository)
    {
        $this->serviceRepository = $serviceRepository;
    }

    function validate(?array $data): bool
    {
        return (
            !empty($data) &&
            $this->checkFieldsPresence($data) &&
            $this->checkFieldTypes($data) &&
            $this->checkFieldValues($data)
        );
    }

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

    function checkPassword($password){
        return (
            !empty($password) &&
            is_string($password) &&
            strlen($password) < 100 && strlen($password) > 6
        );
    }
}