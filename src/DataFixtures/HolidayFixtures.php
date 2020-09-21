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

            $startDate = $this->faker->dateTimeBetween('-3 months','+3 months');
            if($this->faker->boolean(20)){
                $endDate = clone $startDate;
            }else{
                $endDate = $this->faker->dateTimeBetween('-3 months','+3 months');
                if($startDate->getTimestamp() >= $endDate->getTimestamp()){
                    $tmp = clone $startDate;
                    $startDate = clone $endDate;
                    $endDate = clone $tmp;
                }
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