<?php

namespace App\Repository;

use App\Entity\Holiday;
use App\Entity\Service;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Holiday|null find($id, $lockMode = null, $lockVersion = null)
 * @method Holiday|null findOneBy(array $criteria, array $orderBy = null)
 * @method Holiday[]    findAll()
 * @method Holiday[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HolidayRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Holiday::class);
    }

    /**
     * @param User $user
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return mixed
     */
    public function findByUserAndDates(User $user, \DateTime $startDate, \DateTime $endDate){
        $entityManager = $this->getEntityManager();
        $query = $entityManager->createQuery(
            'SELECT h FROM App\Entity\Holiday h WHERE h.user = :user and ((h.startDate between :start and :end) or h.endDate between :start and :end)'
        )->setParameter('user',$user)
            ->setParameter('start',$startDate)
            ->setParameter('end',$endDate);
        return $query->getResult();
    }

    /**
     * @param Service $service
     * @return mixed
     */
    public function findByService(Service $service){
        return $this->createQueryBuilder('h')
            ->innerJoin('h.user','u')
            ->andWhere('h.status <> :rejectedStatus')
            ->setParameter('rejectedStatus',Holiday::STATUS_REJECTED)
            ->andWhere('u.service = :service')
            ->setParameter('service', $service)
            ->getQuery()
            ->getResult()
            ;
    }

    /**
     * @return mixed
     */
    public function findAllExceptRejected(){
        return $this->createQueryBuilder('h')
            ->andWhere('h.status <> :rejectedStatus')
            ->setParameter('rejectedStatus',Holiday::STATUS_REJECTED)
            ->orderBy('h.startDate','DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param Service $service
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return mixed
     */
    public function findByServiceAndDates(Service $service, \DateTime $startDate, \DateTime $endDate){
        $entityManager = $this->getEntityManager();
        $query = $entityManager->createQuery(
            'SELECT h FROM App\Entity\Holiday h join App\Entity\User u WHERE u.service = :service and ((h.startDate between :start and :end) or h.endDate between :start and :end)'
        )->setParameter('service',$service)
            ->setParameter('start',$startDate)
            ->setParameter('end',$endDate);
        return $query->getResult();
    }

    /**
     * @param \DateTime $startDate
     * @param \DateTime $endDate
     * @return mixed
     */
    public function findByDates(\DateTime $startDate, \DateTime $endDate){
        $entityManager = $this->getEntityManager();
        $query = $entityManager->createQuery(
            'SELECT h FROM App\Entity\Holiday h WHERE (h.startDate between :start and :end) or (h.endDate between :start and :end)'
        )->setParameter('start',$startDate)
            ->setParameter('end',$endDate);
        return $query->getResult();
    }


    // /**
    //  * @return Holiday[] Returns an array of Holiday objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('h.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Holiday
    {
        return $this->createQueryBuilder('h')
            ->andWhere('h.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
