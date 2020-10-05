<?php

namespace App\Service\Helper;

use App\Entity\Holiday;
use App\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\HttpFoundation\Request;

class HolidayHelper
{
    /**
     * @param array $holidays
     * @param bool $eventSerialization
     * @param bool $isPersonal
     * @return array
     */
    public static function holidaysSerialization(array $holidays, bool $eventSerialization, bool $isPersonal = false)
    {
        $response = [];
        /** @var Holiday $holiday */
        foreach ($holidays as $holiday){
            $response[] = $eventSerialization ? $holiday->serializeAsEvent($isPersonal) : $holiday->serialize();
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
     * @param ArrayCollection|User[] $users
     * @return array
     */
    public static function dataForTabularCalendar(ArrayCollection $users):array
    {
        $response = [];
        foreach ($users as $user){
            $response[] = [
                "userName" => $user->getName(),
                "events" => self::holidaysSerialization($user->getHolidays(),true)
            ];
        }
        return $response;
    }
}