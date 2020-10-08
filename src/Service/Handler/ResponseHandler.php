<?php


namespace App\Service\Handler;


use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class ResponseHandler
 * @package App\Service\Handler
 */
class ResponseHandler
{
    /**
     * @param string $message
     * @return JsonResponse
     */
    public static function errorResponse(string $message): JsonResponse
    {
        return new JsonResponse([
            'success' => false,
            'message' => $message
        ]);
    }

    /**
     * @param $data
     * @return JsonResponse
     */
    public static function successResponse($data): JsonResponse
    {
        return new JsonResponse([
            'success' => true,
            'data' => $data
        ]);
    }
}