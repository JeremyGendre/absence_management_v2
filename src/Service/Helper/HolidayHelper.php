<?php

namespace App\Service\Helper;

use App\Entity\Holiday;
use App\Entity\User;
use App\Service\Serializer\MySerializer;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\Request;

class HolidayHelper
{
    /**
     * @param array|Collection $holidays
     * @param bool $eventSerialization
     * @param bool $isPersonal
     * @return array
     */
    public static function holidaysSerialization($holidays, bool $eventSerialization, bool $isPersonal = false)
    {
        $response = [];
        if(is_iterable($holidays) === false){
            try{
                $response = MySerializer::serializeOne($holidays);
            }catch(\Exception $e){
                return [];
            }
        }else{
            /** @var Holiday $holiday */
            foreach ($holidays as $holiday){
                $response[] = $eventSerialization ? $holiday->serializeAsEvent($isPersonal) : $holiday->serialize();
            }
        }
        return $response;
    }

    /**
     * @param Request $request
     * @return bool
     */
    public static function isHolidayEventSerialization(Request $request):bool
    {
        return (strpos($request->getRequestUri(),'/events') !== false) || ($request->get('events') !== null && (bool)$request->get('events') === true);
    }

    /**
     * @param array $holidays
     * @param bool $eventSerialization
     * @return array
     */
    public static function defaultHolidaysSerialization(array $holidays, bool $eventSerialization):array
    {
        return self::holidaysSerialization($holidays, $eventSerialization, false);
    }

    /**
     * @param array $holidays
     * @param bool $eventSerialization
     * @return array
     */
    public static function personalHolidaysSerialization(array $holidays, bool $eventSerialization):array
    {
        return self::holidaysSerialization($holidays, $eventSerialization,true);
    }


    /**
     * @param Collection|User[] $users
     * @return array
     */
    public static function dataForTabularCalendar(Collection $users):array
    {
        $response = [];
        foreach ($users as $user){
            if($user->getIsActive() === false){
                continue;
            }
            $response[] = [
                "userName" => $user->getName(),
                "events" => self::holidaysSerialization($user->getHolidays(),true,true)
            ];
        }
        return $response;
    }
}