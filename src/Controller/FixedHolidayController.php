<?php


namespace App\Controller;


use App\Entity\FixedHoliday;
use App\Entity\History;
use App\Entity\User;
use App\Repository\FixedHolidayRepository;
use App\Service\Handler\ResponseHandler;
use App\Service\Helper\HistoryHelper;
use App\Service\Serializer\MySerializer;
use App\Service\Validator\FixedHolidayValidator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/fixed/holiday")
 * Class FixedHolidayController
 * @package App\Controller
 */
class FixedHolidayController extends AbstractController
{
    /**
     * @Route("/all", name="fixed_holiday_all", methods={"GET"})
     * @param FixedHolidayRepository $fixedHolidayRepository
     * @return JsonResponse
     * @throws \Exception
     */
    public function getAll(FixedHolidayRepository $fixedHolidayRepository): JsonResponse
    {
        return new JsonResponse(MySerializer::serializeMany($fixedHolidayRepository->findAll()));
    }

    /**
     * @Route("/new", name="fixed_holiday_new", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function createFixedHoliday(Request $request):JsonResponse
    {
        $data = json_decode($request->getContent(),true);
        if(!FixedHolidayValidator::validate($data)){
            return ResponseHandler::errorResponse("Les données transmises ne sont pas valides");
        }

        /** @var User $user */
        $user = $this->getUser();
        $fixedHoliday = new FixedHoliday();
        $fixedHoliday->setDay($data['day'])->setMonth($data['month'])->setCreatedBy($user);

        /** @var History $fixedHolidayHistory */
        $fixedHolidayHistory = HistoryHelper::historize($fixedHoliday, $this->getUser()->getId(),History::TYPE_CREATE);

        $em = $this->getDoctrine()->getManager();
        $em->persist($fixedHoliday);
        $em->persist($fixedHolidayHistory);
        $em->flush();
        return new JsonResponse($fixedHoliday->serialize());
    }
}