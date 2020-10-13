<?php


namespace App\Controller;


use App\Entity\User;
use App\Repository\FixedHolidayRepository;
use App\Service\Serializer\MySerializer;
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
     * @Route("/{id}/new", name="fixed_holiday_new", methods={"POST"})
     * @param User $user
     * @param Request $request
     * @return JsonResponse
     */
    public function postByUser(User $user, Request $request):JsonResponse
    {
        $data = json_decode($request->getContent());
        dd($data);

    }
}