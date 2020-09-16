<?php

namespace App\DataFixtures;

use App\Entity\Holiday;
use App\Entity\Service;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->encoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $services = [
            "Informatique",
            "Commercial",
            "Comptabilité",
            "CFML RA",
            "CFML RT",
            "CR",
            "Direction",
        ];
        foreach ($services as $serviceName){
            $service = new Service($serviceName);
            $manager->persist($service);
        }
        $manager->flush();

        $user = new User();

        /** @var Service $oneService */
        $oneService = $manager->getRepository(Service::class)->findOneBy([]);
        $user->setService($oneService);
        $user->setTitle("Administrateur système");
        $user->setFirstName("Root");
        $user->setLastName("Route");
        $user->setEmail("jgendre@media-sante.com");
        $user->setUsername("admin");
        $user->setRoles(["ROLE_ADMIN","ROLE_USER"]);
        $user->setPassword($this->encoder->encodePassword($user,"johndoe"));

        $manager->persist($user);
        $manager->flush();

        $holiday = new Holiday();
        $holiday->setCause("Flemme de venir");
        /** @var User $oneUser */
        $oneUser = $manager->getRepository(User::class)->findOneBy([]);
        $holiday->setUser($oneUser);
        $holiday->setStartDate(new \DateTimeImmutable());
        $holiday->setEndDate(new \DateTimeImmutable());
        $holiday->setType(Holiday::TYPE_TIME_CREDIT);
        $holiday->setPeriodType(Holiday::PERIOD_TYPE_ALL_DAY);

        $manager->persist($holiday);
        $manager->flush();
    }
}
