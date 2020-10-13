<?php

namespace App\Entity;

use App\Repository\FixedHolidayRepository;
use App\Service\Serializer\MySerializerInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=FixedHolidayRepository::class)
 */
class FixedHoliday implements MySerializerInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $day;

    /**
     * @ORM\Column(type="integer")
     */
    private $month;

    /**
     * @ORM\ManyToOne(targetEntity=User::class)
     */
    private $createdBy;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDay(): ?int
    {
        return $this->day;
    }

    public function setDay(int $day): self
    {
        $this->day = $day;

        return $this;
    }

    public function getMonth(): ?int
    {
        return $this->month;
    }

    public function setMonth(int $month): self
    {
        $this->month = $month;

        return $this;
    }

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function serialize(): array
    {
        return [
            'id' => $this->id,
            'day' => $this->day,
            'month' => $this->month,
            'createdBy' => $this->getCreatedBy()->getName() ?? null
        ];
    }
}
