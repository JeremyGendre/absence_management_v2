<?php

namespace App\Service\Helper;

use App\Entity\Holiday;
use Symfony\Component\HttpFoundation\Request;

class HolidayHelper
{
    /**
     * @param Request $request
     * @param array $holidays
     * @param bool $isPersonal
     * @return array
     */
    public static function holidaysSerialization(Request $request, array $holidays, bool $isPersonal = false)
    {
        $response = [];
        $eventSerialization = (strpos($request->getRequestUri(),'/events') !== false) || ($request->get('events') !== null && (bool)$request->get('events') === true);
        /** @var Holiday $holiday */
        foreach ($holidays as $holiday){
            $response[] = $eventSerialization ? $holiday->serializeAsEvent($isPersonal) : $holiday->serialize();
        }
        return $response;
    }

    /**
     * @param Request $request
     * @param array $holidays
     * @return array
     */
    public static function defaultHolidaysSerialization(Request $request, array $holidays):array
    {
        return self::holidaysSerialization($request,$holidays,false);
    }

    /**
     * @param Request $request
     * @param array $holidays
     * @return array
     */
    public static function personalHolidaysSerialization(Request $request, array $holidays):array
    {
        return self::holidaysSerialization($request,$holidays,true);
    }
}