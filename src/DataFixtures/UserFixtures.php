<?php


namespace App\DataFixtures;


use App\Entity\Service;
use App\Entity\User;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends BaseFixture implements DependentFixtureInterface
{

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @param ObjectManager $manager
     * @return mixed|void
     */
    protected function loadData(ObjectManager $manager)
    {
        $user = new User();

        /** @var Service $oneService */
        $oneService = $manager->getRepository(Service::class)->findOneBy(['name' => 'Direction']) ?? $this->getRandomEntityElement(Service::class);
        $user->setService($oneService);
        $user->setTitle("Administrateur système");
        $user->setFirstName("Root");
        $user->setLastName("Route");
        $user->setEmail("admin@media-sante.com");
        $user->setUsername("admin");
        $user->setRoles(["ROLE_ADMIN","ROLE_USER"]);
        $user->setPassword($this->encoder->encodePassword($user,"johndoe"));

        $manager->persist($user);
        $manager->flush();

        $this->createMany(15,'user',function(int $i,ObjectManager $manager){
            $user = new User();

            /** @var Service $oneService */
            $oneService = $this->getRandomEntityElement(Service::class);
            $user->setService($oneService);
            $user->setTitle($this->faker->jobTitle);
            $user->setFirstName($this->faker->firstName);
            $user->setLastName($this->faker->lastName);

            $username = $this->faker->userName;
            $user->setUsername($username);
            $user->setEmail($username.'@'.$this->faker->domainName);
            $user->setRoles(["ROLE_USER"]);
            $user->setPassword($this->encoder->encodePassword($user,"johndoe"));

            return $user;
        });
    }

    /**
     * @return array|string[]
     */
    public function getDependencies():array
    {
        return [
            ServiceFixtures::class
        ];
    }
}