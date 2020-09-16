<?php


namespace App\Service\Validator;


class ServiceValidator implements MyValidatorInterface
{

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
            !empty($data['name'])
        );
    }

    function checkFieldTypes(array $data): bool
    {
        return (
            is_string($data['name'])
        );
    }

    function checkFieldValues(array $data): bool
    {
        return (
            strlen($data['name']) < 100
        );
    }
}