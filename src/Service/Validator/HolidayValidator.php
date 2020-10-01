<?php


namespace App\Service\Validator;


use App\Entity\Holiday;
use Symfony\Component\Config\Definition\Exception\Exception;

class HolidayValidator implements MyValidatorInterface
{
    /**
     * @param array|null $data
     * @return bool
     */
    public static function validate(?array $data):bool {
        return (
            !empty($data) &&
            self::checkFieldsPresence($data) &&
            self::checkFieldTypes($data) &&
            self::checkFieldValues($data) &&
            self::checkDate($data['start_date']) &&
            self::checkDate($data['end_date'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldsPresence(array $data):bool {
        return (
            !empty($data['start_date']) &&
            !empty($data['end_date']) &&
            isset($data['type']) &&
            (!isset($data['period_type']) || (is_int($data['period_type']) && array_key_exists($data['period_type'],Holiday::LABEL_PERIOD_TYPES))) &&
            (!isset($data['status']) || (is_int($data['status']) && array_key_exists($data['status'],Holiday::LABEL_STATUS))) &&
            isset($data['cause'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldTypes(array $data):bool {
        return (
            is_string($data['start_date']) &&
            is_string($data['end_date']) &&
            is_int($data['type']) &&
            is_string($data['cause'])
        );
    }

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldValues(array $data): bool
    {
        return (
            $data['start_date'] !== '' &&
            $data['end_date'] !== '' &&
            array_key_exists($data['type'],Holiday::LABEL_TYPES)
        );
    }

    /**
     * @param string $stringDate
     * @return bool
     */
    public static function checkDate(string $stringDate):bool {
        try {
            $date = new \DateTime($stringDate);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}