<?php


namespace App\Service;


use Symfony\Component\HttpFoundation\JsonResponse;

class ErrorHandler
{
    public function jsonResponseError($message):JsonResponse{
        return new JsonResponse([
            'success' => false,
            'message' => $message
        ]);
    }
}