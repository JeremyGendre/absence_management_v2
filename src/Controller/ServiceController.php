<?php


namespace App\Controller;


use App\Entity\Service;
use App\Repository\ServiceRepository;
use App\Service\ErrorHandler;
use App\Service\Validator\ServiceValidator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(path="/api/service")
 * Class ServiceController
 * @package App\Controller
 */
class ServiceController extends AbstractController
{
    /**
     * @Route(path="/all", name="services_all", methods={"GET"})
     * @param ServiceRepository $serviceRepository
     * @return JsonResponse
     */
    public function getAllServices(
        ServiceRepository $serviceRepository
    ):JsonResponse{
        $services = $serviceRepository->findAll();
        $response = [];
        foreach ($services as $service) {
            $response[] = $service->serialize();
        }
        return new JsonResponse($response);
    }

    /**
     * @Route(path="/{id}", name="services_one", methods={"GET"})
     * @param Service $service
     * @return JsonResponse
     */
    public function getOneService(
        Service $service
    ):JsonResponse{
        return new JsonResponse($service->serialize());
    }

    /**
     * @Route(path="/new", name="services_new", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     * @param Request $request
     * @param ErrorHandler $errorHandler
     * @param ServiceValidator $serviceValidator
     * @return JsonResponse
     */
    public function postService(
        Request $request,
        ErrorHandler $errorHandler,
        ServiceValidator $serviceValidator
    ):JsonResponse{
        $data = json_decode($request->getContent(),true);

        if(!$serviceValidator->validate($data)){
            return $errorHandler->jsonResponseError("Les données transmises ne sont pas valides");
        }

        $service = new Service($data['name']);
        $em = $this->getDoctrine()->getManager();
        $em->persist($service);
        $em->flush();
        return new JsonResponse($service->serialize());
    }

    /**
     * @Route(path="/delete/{id}", name="services_delete", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN")
     * @param Service $service
     * @return JsonResponse
     */
    public function deleteService(
        Service $service
    ):JsonResponse{
        $em = $this->getDoctrine()->getManager();
        $em->remove($service);
        $em->flush();
        return new JsonResponse([
            "success" => true,
            "message" => "Service supprimé"
        ]);
    }
}