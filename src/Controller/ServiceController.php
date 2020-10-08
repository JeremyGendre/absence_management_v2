<?php


namespace App\Controller;


use App\Entity\History;
use App\Entity\Service;
use App\Repository\ServiceRepository;
use App\Service\Helper\HistoryHelper;
use App\Service\Serializer\MySerializer;
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
     * @throws \Exception
     */
    public function getAllServices(
        ServiceRepository $serviceRepository
    ):JsonResponse{
        $services = $serviceRepository->findAll();
        $response = MySerializer::serializeMany($services);
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
     * @return JsonResponse
     * @throws \Exception
     */
    public function postService(
        Request $request
    ):JsonResponse{
        $data = json_decode($request->getContent(),true);

        if(!ServiceValidator::validate($data)){
            throw new \Exception("Les données transmises ne sont pas valides");
        }

        $service = new Service($data['name']);
        $service->setIsDeletable(true);

        /** @var History $serviceHistory */
        $serviceHistory = HistoryHelper::historize($service, $this->getUser()->getId(),History::TYPE_CREATE);

        $em = $this->getDoctrine()->getManager();
        $em->persist($service);
        $em->persist($serviceHistory);
        $em->flush();
        return new JsonResponse($service->serialize());
    }

    /**
     * @Route(path="/{id}/edit", name="services_edit", methods={"PUT"})
     * @IsGranted("ROLE_ADMIN")
     * @param Service $service
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function editService(Service $service, Request $request):JsonResponse{
        $data = json_decode($request->getContent(),true);

        if(!ServiceValidator::validate($data)){
            throw new \Exception("Les données transmises ne sont pas valides");
        }

        $service->setName($data['name']);

        /** @var History $serviceHistory */
        $serviceHistory = HistoryHelper::historize($service, $this->getUser()->getId(),History::TYPE_EDIT);

        $em = $this->getDoctrine()->getManager();
        $em->persist($service);
        $em->persist($serviceHistory);
        $em->flush();
        return new JsonResponse($service->serialize());
    }

    /**
     * @Route(path="/delete/{id}", name="services_delete", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN")
     * @param Service $service
     * @param ServiceRepository $serviceRepository
     * @return JsonResponse
     * @throws \Exception
     */
    public function deleteService(
        Service $service,
        ServiceRepository $serviceRepository
    ):JsonResponse{
        $em = $this->getDoctrine()->getManager();
        $defaultService = $serviceRepository->findOneBy([]);
        if($defaultService !== null){
            foreach ($service->getUsers() as $user) {
                $user->setService($defaultService);
                $em->persist($user);
            }
        }

        /** @var History $serviceHistory */
        $serviceHistory = HistoryHelper::historize($service, $this->getUser()->getId(),History::TYPE_DELETE);

        $em->persist($serviceHistory);
        $em->remove($service);
        $em->flush();
        return new JsonResponse([
            "success" => true,
            "message" => "Service supprimé"
        ]);
    }
}