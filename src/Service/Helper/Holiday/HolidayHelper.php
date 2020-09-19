<?php

namespace App\Service\Helper\Holiday;

use App\Entity\Holiday;
use Symfony\Component\HttpFoundation\Request;

class HolidayHelper
{
    public static function holidaysSerialization(Request $request, array $holidays):array
    {
        $response = [];
        $eventSerialization = (strpos($request->getRequestUri(),'/events') !== false) || ($request->get('events') !== null && (bool)$request->get('events') === true);
        /** @var Holiday $holiday */
        foreach ($holidays as $holiday){
            $response[] = $eventSerialization ? $holiday->serializeAsEvent() : $holiday->serialize();
        }
        return $response;
    }
}