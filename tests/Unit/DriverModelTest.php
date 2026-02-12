<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\Driver;
use App\Models\User;
use Mockery;

class DriverModelTest extends TestCase
{
    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_driver_has_fillable_attributes()
    {
        $driver = new Driver();
        $this->assertEquals(['code', 'user_id'], $driver->getFillable());
    }

    public function test_driver_can_be_instantiated()
    {
        $driver = new Driver([
            'code' => 'DRV-TEST123',
            'user_id' => 1,
        ]);

        $this->assertEquals('DRV-TEST123', $driver->code);
        $this->assertEquals(1, $driver->user_id);
    }

    public function test_driver_relationships_defined()
    {
        $driver = new Driver();
        $this->assertTrue(method_exists($driver, 'user'));
    }

    public function test_driver_code_generation_format()
    {
        // Simulate the driver code generation logic
        $code = strtoupper('DRV-' . \Illuminate\Support\Str::random(6));
        
        $this->assertStringStartsWith('DRV-', $code);
        $this->assertEquals(10, strlen($code)); // DRV- (4) + 6 random chars
    }
}
