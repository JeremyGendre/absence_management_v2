<?php


namespace App\DataFixtures;


use App\Entity\Service;
use Doctrine\Persistence\ObjectManager;

class ServiceFixtures extends BaseFixture
{
    /**
     * @var string[]
     */
    private $services = [
        Service::DEFAULT_SERVICE_NAME,
        "Informatique",
        "Commercial",
        "Comptabilité",
        "CFML RA",
        "CFML RT",
        "CR",
        "Direction",
    ];

    /**
     * @param ObjectManager $manager
     * @return mixed|void
     */
    protected function loadData(ObjectManager $manager)
    {
        foreach ($this->services as $serviceName) {
            $service = new Service($serviceName);
            $manager->persist($service);
        }
        $manager->flush();
    }
}