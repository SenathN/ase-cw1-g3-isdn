<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * User role constants
     */
    public const ROLE_CUSTOMER = 'customer';
    public const ROLE_RDC_STAFF = 'rdc_staff';
    public const ROLE_ADMIN = 'admin';
    public const ROLE_LOGISTICS = 'logistics';
    public const ROLE_DRIVER = 'driver';
    public const ROLE_ACCOUNTS = 'accounts';

    /**
     * RDC Location constants
     */
    public const RDC_NORTH = 'North';
    public const RDC_SOUTH = 'South';
    public const RDC_EAST = 'East';
    public const RDC_WEST = 'West';
    public const RDC_CENTRAL = 'Central';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'preferred_rdc',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all available roles
     */
    public static function getRoles(): array
    {
        return [
            self::ROLE_CUSTOMER,
            self::ROLE_RDC_STAFF,
            self::ROLE_ADMIN,
            self::ROLE_LOGISTICS,
            self::ROLE_DRIVER,
            self::ROLE_ACCOUNTS,
        ];
    }

    /**
     * Get all RDC locations
     */
    public static function getRdcLocations(): array
    {
        return [
            self::RDC_NORTH,
            self::RDC_SOUTH,
            self::RDC_EAST,
            self::RDC_WEST,
            self::RDC_CENTRAL,
        ];
    }

    /**
     * Check if user has a specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is a customer
     */
    public function isCustomer(): bool
    {
        return $this->hasRole(self::ROLE_CUSTOMER);
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    /**
     * Get the dashboard route for this user based on role
     */
    public function getDashboardRoute(): string
    {
        return match ($this->role) {
            self::ROLE_CUSTOMER => 'customer.dashboard',
            self::ROLE_RDC_STAFF => 'rdc.dashboard',
            self::ROLE_ADMIN => 'admin.dashboard',
            self::ROLE_LOGISTICS => 'logistics.dashboard',
            self::ROLE_DRIVER => 'driver.dashboard',
            self::ROLE_ACCOUNTS => 'accounts.dashboard',
            default => 'customer.dashboard',
        };
    }
}
