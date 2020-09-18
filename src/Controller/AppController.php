<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="home")
     * @return Response
     */
    public function index()
    {
        /** @var User $user */
        $user = $this->getUser();
        return $this->render('app/index.html.twig',[
            'user' => json_encode($user->serialize())
        ]);
    }
}
