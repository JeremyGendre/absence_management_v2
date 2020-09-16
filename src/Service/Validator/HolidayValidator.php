<?php


namespace App\Service\Validator;


use App\Entity\Holiday;
use Symfony\Component\Config\Definition\Exception\Exception;

class HolidayValidator implements MyValidatorInterface
{
    public function validate(?array $data):bool {
        return (
            !empty($data) &&
            $this->checkFieldsPresence($data) &&
            $this->checkFieldTypes($data) &&
            $this->checkFieldValues($data) &&
            $this->checkDate($data['start_date']) &&
            $this->checkDate($data['end_date'])
        );
    }

    public function checkFieldsPresence(array $data):bool {
        return (
            !empty($data['start_date']) &&
            !empty($data['end_date']) &&
            isset($data['type']) &&
            (!isset($data['period_type']) || (is_int($data['period_type']) && array_key_exists($data['period_type'],Holiday::LABEL_PERIOD_TYPES))) &&
            (!isset($data['status']) || (is_int($data['status']) && array_key_exists($data['status'],Holiday::LABEL_STATUS))) &&
            isset($data['cause'])
        );
    }

    public function checkFieldTypes(array $data):bool {
        return (
            is_string($data['start_date']) &&
            is_string($data['end_date']) &&
            is_int($data['type']) &&
            is_string($data['cause'])
        );
    }

    function checkFieldValues(array $data): bool
    {
        return (
            $data['start_date'] !== '' &&
            $data['end_date'] !== '' &&
            array_key_exists($data['type'],Holiday::LABEL_TYPES)
        );
    }

    private function checkDate(string $stringDate):bool {
        try {
            $date = new \DateTime($stringDate);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}