<?php


namespace App\DataFixtures;


use App\Entity\Service;
use Doctrine\Persistence\ObjectManager;

class ServiceFixtures extends BaseFixture
{
    /**
     * @var array
     */
    private $services = [
        [
            "name" => Service::DEFAULT_SERVICE_NAME,
            "deletable" => false
        ],
        ["name" => "Informatique", "deletable" => true],
        ["name" => "Commercial", "deletable" => true],
        ["name" => "Comptabilité", "deletable" => true],
        ["name" => "CFML RA", "deletable" => true],
        ["name" => "CFML RT", "deletable" => true],
        ["name" => "CR", "deletable" => true],
        ["name" => "Direction", "deletable" => true]
    ];

    /**
     * @param ObjectManager $manager
     * @return mixed|void
     */
    protected function loadData(ObjectManager $manager)
    {
        foreach ($this->services as $serviceOptions) {
            $service = new Service($serviceOptions['name']);
            $service->setIsDeletable($serviceOptions['deletable']);
            $manager->persist($service);
        }
        $manager->flush();
    }
}