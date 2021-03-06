<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class PageNotFoundController extends AbstractController
{
    /**
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function pageNotFoundAction(Request $request)
    {
        /** @var User $user */
        $user = $this->getUser();
        if($user !== null){
            if($request->isXmlHttpRequest()){
                throw new NotFoundHttpException('Controller not found');
            }
            return $this->render('app/index.html.twig',[
                'user' => json_encode($user->serialize())
            ]);
        }
        return $this->redirectToRoute('app_login');
    }
}