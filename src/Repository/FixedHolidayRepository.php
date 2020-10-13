<?php

namespace App\Repository;

use App\Entity\FixedHoliday;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FixedHoliday|null find($id, $lockMode = null, $lockVersion = null)
 * @method FixedHoliday|null findOneBy(array $criteria, array $orderBy = null)
 * @method FixedHoliday[]    findAll()
 * @method FixedHoliday[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FixedHolidayRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FixedHoliday::class);
    }

    // /**
    //  * @return FixedHoliday[] Returns an array of FixedHoliday objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FixedHoliday
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
