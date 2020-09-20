<?php

namespace App\Entity;

use App\Repository\HolidayRepository;
use App\Service\MySerializerInterface;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=HolidayRepository::class)
 */
class Holiday implements MySerializerInterface
{
    public const STATUS_PENDING = 1;
    public const STATUS_REJECTED = 2;
    public const STATUS_ACCEPTED = 3;

    public const LABEL_STATUS = [
        self::STATUS_PENDING => "Demandé",
        self::STATUS_REJECTED => "Refusé",
        self::STATUS_ACCEPTED => "Accepté",
    ];

    public const STATUS_EVENTS_COLORS = [
        self::STATUS_PENDING => "#F1C04F",
        self::STATUS_REJECTED => "#E72D2D",
        self::STATUS_ACCEPTED => "#4FCD49",
    ];

    public const TYPE_PAYED = 1;
    public const TYPE_TIME_CREDIT = 2;
    public const TYPE_MEDICAL = 3;

    public const LABEL_TYPES = [
        self::TYPE_PAYED => "Congés payés",
        self::TYPE_TIME_CREDIT => "Crédit temps",
        self::TYPE_MEDICAL => "Arrêt maladie",
    ];

    public const PERIOD_TYPE_MORNING = 1;
    public const PERIOD_TYPE_AFTERNOON = 2;
    public const PERIOD_TYPE_ALL_DAY = 3;

    public const LABEL_PERIOD_TYPES = [
        self::PERIOD_TYPE_MORNING => "Matin",
        self::PERIOD_TYPE_AFTERNOON => "Après-midi",
        self::PERIOD_TYPE_ALL_DAY => "Journée",
    ];

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $startDate;

    /**
     * @ORM\Column(type="datetime")
     */
    private $endDate;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="integer")
     */
    private $type;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $periodType;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $cause;

    /**
     * @ORM\Column(type="integer")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="holidays")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->status = self::STATUS_PENDING;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): self
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getPeriodType(): ?int
    {
        return $this->periodType;
    }

    public function setPeriodType(?int $periodType): self
    {
        $this->periodType = $periodType;

        return $this;
    }

    public function getCause(): ?string
    {
        return $this->cause;
    }

    public function setCause(?string $cause): self
    {
        $this->cause = $cause;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function serialize(): array
    {
        return [
            "id" => $this->id,
            "start_date" => $this->getStartDate(),
            "end_date" => $this->getEndDate(),
            "created_at" => $this->getCreatedAt(),
            "type" => $this->type,
            "period_type" => $this->periodType,
            "cause" => $this->cause,
            "status" => $this->status,
            "user" => $this->getUser()->serializeForHoliday()
        ];
    }

    public function serializeAsEvent(){
        $color = self::STATUS_EVENTS_COLORS[$this->status];
        return [
            "start" => $this->getStartDate()->format('Y-m-d'),
            "end" => $this->getEndDate()->format('Y-m-d'),
            "title" => $this->cause ?? '',
            "backgroundColor" => $color,
            "borderColor" => $color,
        ];
    }
}
