<?php


namespace App\DataFixtures;


use App\Entity\FixedHoliday;
use App\Entity\User;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class FixedHolidayFixtures extends BaseFixture implements DependentFixtureInterface
{
    /**
     * @param ObjectManager $manager
     * @return mixed|void
     */
    protected function loadData(ObjectManager $manager)
    {
        $data = [
            [ "day" => 1, "month" => 1 ],
            [ "day" => 5, "month" => 4 ],
            [ "day" => 1, "month" => 5 ],
            [ "day" => 8, "month" => 5 ],
            [ "day" => 13, "month" => 5 ],
            [ "day" => 24, "month" => 5 ],
            [ "day" => 14, "month" => 7 ],
            [ "day" => 15, "month" => 8 ],
            [ "day" => 1, "month" => 11 ],
            [ "day" => 11, "month" => 11 ],
            [ "day" => 25, "month" => 12 ]
        ];
        foreach ($data as $dayData){
            $day = new FixedHoliday();
            $day->setDay($dayData['day']);
            $day->setMonth($dayData['month']);
            $day->setCreatedBy($this->getRandomEntityElement(User::class));
            $manager->persist($day);
        }

        $manager->flush();
    }

    /**
     * @return string[]
     */
    public function getDependencies()
    {
        return [
            UserFixtures::class
        ];
    }
}