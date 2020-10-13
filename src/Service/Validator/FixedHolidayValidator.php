<?php


namespace App\Service\Validator;


class FixedHolidayValidator implements MyValidatorInterface
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
            !empty($data['day']) &&
            !empty($data['month'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldTypes(array $data): bool
    {
        return (
            is_int($data['day']) &&
            is_int($data['month'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldValues(array $data): bool
    {
        return (
            ($data['day'] > 0 && $data['day'] <= 31) &&
            ($data['month'] > 0 && $data['month'] <= 12)
        );
    }
}