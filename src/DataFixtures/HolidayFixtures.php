<?php


namespace App\DataFixtures;


use App\Entity\Holiday;
use App\Entity\User;
use App\Service\Helper\DateTimeHelper;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class HolidayFixtures extends BaseFixture implements DependentFixtureInterface
{

    protected function loadData(ObjectManager $manager)
    {
        $this->createMany(30,'holiday',function(int $i, ObjectManager $manager){
            $holiday = new Holiday();

            /** @var User $oneUser */
            $oneUser = $this->getRandomEntityElement(User::class);
            $holiday->setUser($oneUser);
            $holiday->setCause($this->faker->text(50));

            $startDate = $this->faker->dateTimeBetween('-2 months','+3 months');
            $endDate = clone $startDate;
            if($this->faker->boolean(80)){
                $endDate->add(new \DateInterval('P'. $this->faker->numberBetween(1,14) .'D'));
            }

            $holiday->setStartDate($startDate);
            $holiday->setEndDate($endDate);
            $holiday->setType($this->faker->randomElement(Holiday::TYPES));
            $holiday->setStatus($this->faker->randomElement(Holiday::STATUS));
            if(DateTimeHelper::isSameDate($startDate,$endDate)){
                $holiday->setPeriodType($this->faker->randomElement(Holiday::PERIOD_TYPES));
            }

            return $holiday;
        });
    }

    /**
     * @return array|string[]
     */
    public function getDependencies():array
    {
        return [
            UserFixtures::class
        ];
    }
}