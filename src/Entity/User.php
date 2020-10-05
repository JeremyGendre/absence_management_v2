<?php

namespace App\Entity;

use App\Repository\UserRepository;
use App\Service\Helper\RoleHelper;
use App\Service\Serializer\MySerializerInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements UserInterface, MySerializerInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $lastName;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\ManyToOne(targetEntity=Service::class, inversedBy="users")
     * @ORM\JoinColumn(nullable=false)
     */
    private $service;

    /**
     * @ORM\OneToMany(targetEntity=Holiday::class, mappedBy="user", orphanRemoval=true)
     */
    private $holidays;

    public function __construct()
    {
        $this->holidays = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->getName();
    }

    /**
     * @return string
     */
    public function getName(){
        return $this->firstName . ' ' . $this->lastName;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    /**
     * @param string $username
     * @return User
     */
    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        return array_unique($roles);
    }

    /**
     * @param string $role
     * @return $this
     */
    public function addRole(string $role){
        if(in_array($role,RoleHelper::ROLES) && array_search($role,$this->roles) === false){
            $this->roles[] = $role;
        }
        return $this;
    }

    /**
     * @param string $role
     */
    public function removeRole(string $role){
        $newRoles = [];
        foreach ($this->roles as $key => $value) {
            if($value !== $role){
                $newRoles[] = $value;
            }
        }
        $this->roles = $newRoles;
    }

    /**
     * @param string $role
     * @return bool
     */
    public function hasRole(string $role){
        if(in_array($role,$this->roles)){
            return true;
        }
        return false;
    }

    /**
     * @param array $roles
     * @return User
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return bool
     */
    public function isAdmin():bool
    {
        return $this->hasRole(RoleHelper::ROLE_ADMIN) || $this->hasRole(RoleHelper::ROLE_SUPER_ADMIN);
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    /**
     * @param string $password
     * @return User
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return string|null
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     * @return User
     */
    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     * @return User
     */
    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTimeInterface $createdAt
     * @return User
     */
    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string $email
     * @return User
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return User
     */
    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Service|null
     */
    public function getService(): ?Service
    {
        return $this->service;
    }

    /**
     * @param Service|null $service
     * @return User
     */
    public function setService(?Service $service): self
    {
        $this->service = $service;

        return $this;
    }

    /**
     * @return Collection|Holiday[]
     */
    public function getHolidays(): Collection
    {
        return $this->holidays;
    }

    /**
     * @param Holiday $holiday
     * @return User
     */
    public function addHoliday(Holiday $holiday): self
    {
        if (!$this->holidays->contains($holiday)) {
            $this->holidays[] = $holiday;
            $holiday->setUser($this);
        }

        return $this;
    }

    /**
     * @param Holiday $holiday
     * @return User
     */
    public function removeHoliday(Holiday $holiday): self
    {
        if ($this->holidays->contains($holiday)) {
            $this->holidays->removeElement($holiday);
            // set the owning side to null (unless already changed)
            if ($holiday->getUser() === $this) {
                $holiday->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return array
     */
    public function serialize(): array
    {
        return [
            "id" => $this->id,
            "last_name" => $this->lastName,
            "first_name" => $this->firstName,
            "email" => $this->email,
            "username" => $this->username,
            "roles" => $this->roles,
            "service" => $this->getService()->serialize(),
            "title" => $this->title,
            "created_at" => $this->createdAt->format('d/m/Y')
        ];
    }

    /**
     * @return array
     */
    public function serializeForHoliday():array{
        return [
            "id" => $this->id,
            "display_name" => $this->__toString(),
            "username" => $this->username,
            "service" => $this->getService()->serialize()
        ];
    }
}
