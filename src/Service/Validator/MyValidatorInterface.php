<?php


namespace App\Service\Validator;

/**
 * Interface MyValidatorInterface
 * @package App\Service\Validator
 */
interface MyValidatorInterface
{
    /**
     * @param array|null $data
     * @return bool
     */
    public static function validate(?array $data):bool;

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldsPresence(array $data):bool;

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldTypes(array $data):bool;

    /**
     * @param array $data
     * @return bool
     */
    public static function checkFieldValues(array $data):bool;
}