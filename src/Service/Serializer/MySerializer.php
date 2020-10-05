<?php


namespace App\Service\Serializer;


class MySerializer
{
    /**
     * @param array $haystack
     * @return array
     * @throws \Exception
     */
    public static function serializeMany(array $haystack)
    {
        $response = [];
        foreach($haystack as $value){
            $response[] = self::serializeOne($value);
        }
        return $response;
    }

    /**
     * @param $value
     * @return bool
     */
    public static function isSerializable($value):bool
    {
        return (is_object($value) === false || method_exists($value,'serialize') === true);
    }

    /**
     * @param $value
     * @return mixed
     * @throws \Exception
     */
    public static function serializeOne($value)
    {
        if(self::isSerializable($value) === false){
            throw new \Exception("If the value you want to serialize is an object, you need to implement a 'serialize' method in it.");
        }
        if(is_object($value) === false){
            return $value;
        }else{
            return  $value->serialize();
        }
    }
}