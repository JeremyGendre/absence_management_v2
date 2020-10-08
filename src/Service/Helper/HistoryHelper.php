<?php


namespace App\Service\Helper;


use App\Entity\History;
use App\Service\Serializer\MySerializer;

/**
 * Class HistoryHelper
 * @package App\Service\Helper
 */
class HistoryHelper
{
    /**
     * @param $object
     * @param int $authUserId
     * @param int $type
     * @return History
     * @throws \Exception
     */
    public static function historize($object, int $authUserId, int $type)
    {
        if(MySerializer::isSerializable($object) === false){
            throw new \Exception("Impossible to historize something not serializable");
        }
        if(in_array($type,History::TYPES) === false){
            throw new \Exception('Parameter $type given to HistoryHelper::historize must be part of the History::TYPES array');
        }

        $historizedObject = new History();
        $historizedObject->setType($type)
            ->setDoneAt(new \DateTimeImmutable())
            ->setEntity(get_class($object))
            ->setValue(MySerializer::serializeOne($object))
            ->setDoneBy($authUserId);
        return $historizedObject;
    }
}