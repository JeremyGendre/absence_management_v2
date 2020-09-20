<?php

namespace App\Controller;

use App\Entity\Holiday;
use App\Entity\Service;
use App\Entity\User;
use App\Repository\HolidayRepository;
use App\Service\ErrorHandler;
use App\Service\Helper\Holiday\HolidayHelper;
use App\Service\Validator\HolidayValidator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class HolidayController
 * @package App\Controller
 * @Route(path="/api/holiday")
 */
class HolidayController extends AbstractController
{
    /**
     * @Route(path="/all", name="holidays_all", methods={"GET"})
     * @Route(path="/all/events", name="holidays_all_events", methods={"GET"})
     * @param Request $request
     * @param HolidayRepository $holidayRepository
     * @return JsonResponse
     */
    public function getAllHolidays(Request $request, HolidayRepository $holidayRepository) :JsonResponse {
        $holidays = $holidayRepository->findBy([],["startDate"=>"DESC"]);
        $response = HolidayHelper::holidaysSerialization($request,$holidays);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/user/{id}", name="holidays_by_user", methods={"GET"})
     * @Route(path="/user/{id}/events", name="holidays_events_by_user", methods={"GET"})
     * @param Request $request
     * @param User $user
     * @param HolidayRepository $holidayRepository
     * @return JsonResponse
     */
    public function getByUser(Request $request, User $user,HolidayRepository $holidayRepository) : JsonResponse{
        $holidays = $holidayRepository->findBy(["user" => $user],["startDate"=>"DESC"]);
        $response = HolidayHelper::holidaysSerialization($request,$holidays);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/status/{status}", name="holidays_by_status", methods={"GET"})
     * @Route(path="/status/{status}/event", name="holidays_events_by_status", methods={"GET"})
     * @param Request $request
     * @param int $status
     * @param HolidayRepository $holidayRepository
     * @param ErrorHandler $errorHandler
     * @return JsonResponse
     * @throws \Exception
     */
    public function getByStatus(
        Request $request,
        int $status,
        HolidayRepository $holidayRepository,
        ErrorHandler $errorHandler
    ):JsonResponse{
        if(!array_key_exists($status,Holiday::LABEL_STATUS)){
            return $errorHandler->jsonResponseError("Le status recherché n'est correct.");
        }
        $holidays = $holidayRepository->findBy(["status" => $status],["startDate"=>"DESC"]);
        $response = [];
        $today = new \DateTime();
        $eventSerialization = strpos($request->getRequestUri(),'/events') !== false;
        foreach ($holidays as $holiday){
            if($holiday->getEndDate() > $today){
                $response[] = $eventSerialization ? $holiday->serializeAsEvent() : $holiday->serialize();
            }
        }
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/user/{id}/dates/{timestampStart}/{timestampEnd}", name="holidays_by_user_and_dates", methods={"GET"})
     * @Route(path="/user/{id}/dates/{timestampStart}/{timestampEnd}/events", name="holidays_events_by_user_and_dates", methods={"GET"})
     * @param Request $request
     * @param User $user
     * @param int $timestampStart
     * @param int $timestampEnd
     * @param HolidayRepository $holidayRepository
     * @param ErrorHandler $errorHandler
     * @return JsonResponse
     * @throws \Exception
     */
    public function getByUserAndDates(
        Request $request,
        User $user,
        int $timestampStart,
        int $timestampEnd,
        HolidayRepository $holidayRepository,
        ErrorHandler $errorHandler
    ):JsonResponse{
        try{
            $start = new \DateTime();
            $start->setTimestamp($timestampStart);

            $end = new \DateTime();
            $end->setTimestamp($timestampEnd);
        }catch(Exception $exception){
            return $errorHandler->jsonResponseError("Un problème est survenu lors de la récupération des dates");
        }
        $holidays = $holidayRepository->findByUserAndDates($user,$start,$end);
        $response = HolidayHelper::holidaysSerialization($request,$holidays);
        return new JsonResponse($response);
    }


    /**
     * @Route(path="/service/{id}/dates/{timestampStart}/{timestampEnd}", name="holidays_by_service_and_dates", methods={"GET"})
     * @Route(path="/service/{id}/dates/{timestampStart}/{timestampEnd}/events", name="holidays_events_by_service_and_dates", methods={"GET"})
     * @param Request $request
     * @param Service $service
     * @param int $timestampStart
     * @param int $timestampEnd
     * @param HolidayRepository $holidayRepository
     * @param ErrorHandler $errorHandler
     * @return JsonResponse
     * @throws \Exception
     */
    public function getByServiceAndDates(
        Request $request,
        Service $service,
        int $timestampStart,
        int $timestampEnd,
        HolidayRepository $holidayRepository,
        ErrorHandler $errorHandler
    ):JsonResponse{
        try{
            $start = new \DateTime();
            $start->setTimestamp($timestampStart);

            $end = new \DateTime();
            $end->setTimestamp($timestampEnd);
        }catch(Exception $exception){
            return $errorHandler->jsonResponseError("Un problème est survenu lors de la récupération des dates");
        }
        $holidays = $holidayRepository->findByServiceAndDates($service,$start,$end);
        $response = HolidayHelper::holidaysSerialization($request,$holidays);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/service/{id}", name="holidays_by_service", methods={"GET"})
     * @Route(path="/service/{id}/events", name="holidays_events_by_service", methods={"GET"})
     * @param Request $request
     * @param HolidayRepository $holidayRepository
     * @param Service $service
     * @return JsonResponse
     */
    public function getByService(
        Request $request,
        HolidayRepository $holidayRepository,
        Service $service
    ):JsonResponse{
        $holidays = $holidayRepository->findByService($service);
        $response = HolidayHelper::holidaysSerialization($request,$holidays);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/dates/{timestampStart}/{timestampEnd}", name="holidays_by_dates", methods={"GET"})
     * @Route(path="/dates/{timestampStart}/{timestampEnd}/events", name="holidays_events_by_dates", methods={"GET"})
     * @param Request $request
     * @param int $timestampStart
     * @param int $timestampEnd
     * @param HolidayRepository $holidayRepository
     * @param ErrorHandler $errorHandler
     * @return JsonResponse
     * @throws \Exception
     */
    public function getByDates(
        Request $request,
        int $timestampStart,
        int $timestampEnd,
        HolidayRepository $holidayRepository,
        ErrorHandler $errorHandler
    ):JsonResponse{
        try{
            $start = new \DateTime();
            $start->setTimestamp($timestampStart);

            $end = new \DateTime();
            $end->setTimestamp($timestampEnd);
        }catch(Exception $exception){
            return $errorHandler->jsonResponseError("Un problème est survenu lors de la récupération des dates");
        }
        $holidays = $holidayRepository->findByDates($start,$end);
        $response = HolidayHelper::holidaysSerialization($request,$holidays);
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/new/user/{id}", name="holiday_new_by_user", methods={"POST"})
     * @param User $user
     * @param Request $request
     * @param ErrorHandler $errorHandler
     * @param HolidayValidator $holidayValidator
     * @return JsonResponse
     * @throws \Exception
     */
    public function postByUser(
        User $user,
        Request $request,
        ErrorHandler $errorHandler,
        HolidayValidator $holidayValidator
    ):JsonResponse{
        /** @var User $authUser */
        $authUser = $this->getUser();
        if($authUser !== $user && !$authUser->hasRole("ROLE_ADMIN")){
            return $errorHandler->jsonResponseError("Vous devez être le créateur de ces congés ou être administrateur pour faire cette action.");
        }
        $data = json_decode($request->getContent(),true);
        if(!$holidayValidator->validate($data)){
            return $errorHandler->jsonResponseError("Les données transmises ne sont pas valides");
        }

        $holiday = new Holiday();
        $holiday->setUser($user);
        $holiday->setStartDate(new \DateTime($data['start_date']));
        $holiday->setEndDate(new \DateTime($data['end_date']));
        $holiday->setCause($data['cause']);
        $holiday->setType($data['type']);
        if(isset($data['period_type'])){
            $holiday->setPeriodType($data['period_type']);
        }
        if(isset($data['status'])){
            $holiday->setStatus($data['status']);
        }elseif($user->hasRole('ROLE_ADMIN')){
            $holiday->setStatus(Holiday::STATUS_ACCEPTED);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($holiday);
        $em->flush();
        return new JsonResponse($holiday->serialize());
    }

    /**
     * @Route(path="/accept/{id}", name="holiday_accept", methods={"PUT"})
     * @param Holiday $holiday
     * @return JsonResponse
     */
    public function acceptHoliday(
        Holiday $holiday
    ):JsonResponse{
        $holiday->setStatus(Holiday::STATUS_ACCEPTED);
        $em = $this->getDoctrine()->getManager();
        $em->persist($holiday);
        $em->flush();
        return new JsonResponse($holiday->serialize());
    }

    /**
     * @Route(path="/reject/{id}", name="holiday_reject", methods={"PUT"})
     * @param Holiday $holiday
     * @return JsonResponse
     */
    public function rejectHoliday(
        Holiday $holiday
    ):JsonResponse{
        $holiday->setStatus(Holiday::STATUS_REJECTED);
        $em = $this->getDoctrine()->getManager();
        $em->persist($holiday);
        $em->flush();
        return new JsonResponse($holiday->serialize());
    }

    /**
     * @Route(path="/delete/{id}", name="holiday_delete", methods={"DELETE"})
     * @param Holiday $holiday
     * @param ErrorHandler $errorHandler
     * @return JsonResponse
     */
    public function deleteHoliday(
        Holiday $holiday,
        ErrorHandler $errorHandler
    ):JsonResponse{
        /** @var User $authUser */
        $authUser = $this->getUser();
        if($holiday->getUser() !== $authUser && !$authUser->hasRole("ROLE_ADMIN")){
            return $errorHandler->jsonResponseError("Vous devez être le créateur de ces congés ou être administrateur pour faire cette action.");
        }
        $em = $this->getDoctrine()->getManager();
        $em->remove($holiday);
        $em->flush();
        return new JsonResponse([
            "success" => true,
            "message" => "Période de congés supprimée"
        ]);
    }
}