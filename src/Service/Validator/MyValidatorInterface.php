<?php


namespace App\Service\Validator;


interface MyValidatorInterface
{
    function validate(?array $data):bool;

    function checkFieldsPresence(array $data):bool;

    function checkFieldTypes(array $data):bool;

    function checkFieldValues(array $data):bool;
}