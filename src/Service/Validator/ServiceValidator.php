<?php


namespace App\Service\Validator;


class ServiceValidator implements MyValidatorInterface
{
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
            !empty($data['name'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldTypes(array $data): bool
    {
        return (
            is_string($data['name'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldValues(array $data): bool
    {
        return (
            strlen($data['name']) < 100
        );
    }
}