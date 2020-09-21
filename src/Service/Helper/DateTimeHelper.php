<?php


namespace App\Service\Helper;

/**
 * Class DateTimeHelper
 * @package App\Service\Helper
 */
class DateTimeHelper
{
    /**
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return bool
     */
    public static function isSameDate(\DateTime $startDate, \DateTime $endDate):bool
    {
        return self::isSameDay($startDate,$endDate)
            && self::isSameMonth($startDate,$endDate)
            && self::isSameYear($startDate,$endDate);
    }

    /**
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return bool
     */
    public static function isSameYear(\DateTime $startDate, \DateTime $endDate):bool
    {
        return self::getYear($startDate) === self::getYear($endDate);
    }

    /**
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return bool
     */
    public static function isSameMonth(\DateTime $startDate, \DateTime $endDate):bool
    {
        return self::getMonth($startDate) === self::getMonth($endDate);
    }

    /**
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return bool
     */
    public static function isSameDay(\DateTime $startDate, \DateTime $endDate):bool
    {
        return self::getDay($startDate) === self::getDay($endDate);
    }

    /**
     * @param \DateTime $dateTime
     * @return string
     */
    public static function getYear(\DateTime $dateTime):string
    {
        return $dateTime->format('Y');
    }

    /**
     * @param \DateTime $dateTime
     * @return string
     */
    public static function getMonth(\DateTime $dateTime):string
    {
        return $dateTime->format('m');
    }

    /**
     * @param \DateTime $dateTime
     * @return string
     */
    public static function getDay(\DateTime $dateTime):string
    {
        return $dateTime->format('d');
    }
}