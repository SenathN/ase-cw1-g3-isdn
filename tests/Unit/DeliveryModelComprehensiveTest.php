<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\Driver;
use App\Models\User;

class DeliveryModelComprehensiveTest extends TestCase
{
    public function test_delivery_has_fillable_attributes()
    {
        $delivery = new Delivery();
        
        $expected = [
            'code',
            'order_id',
            'driver_id',
            'scheduled_date',
            'scheduled_time',
            'route_notes',
            'status',
            'created_by'
        ];
        
        $this->assertEquals($expected, $delivery->getFillable());
    }

    public function test_delivery_can_be_instantiated_with_attributes()
    {
        $delivery = new Delivery([
            'code' => 'DEL-001',
            'order_id' => 1,
            'driver_id' => 1,
            'scheduled_date' => '2026-02-15',
            'scheduled_time' => '10:00:00',
            'route_notes' => 'Leave at door',
            'status' => 'scheduled',
            'created_by' => 1,
        ]);

        $this->assertEquals('DEL-001', $delivery->code);
        $this->assertEquals(1, $delivery->order_id);
        $this->assertEquals(1, $delivery->driver_id);
        $this->assertEquals('2026-02-15', $delivery->scheduled_date);
        $this->assertEquals('10:00:00', $delivery->scheduled_time);
        $this->assertEquals('Leave at door', $delivery->route_notes);
        $this->assertEquals('scheduled', $delivery->status);
        $this->assertEquals(1, $delivery->created_by);
    }

    public function test_delivery_methods_exist()
    {
        $delivery = new Delivery();
        
        $this->assertTrue(method_exists($delivery, 'order'));
        $this->assertTrue(method_exists($delivery, 'driver'));
        $this->assertTrue(method_exists($delivery, 'creator'));
    }

    public function test_delivery_valid_statuses()
    {
        $validStatuses = ['scheduled', 'pending', 'in_progress', 'delivered', 'failed', 'cancelled'];
        
        foreach ($validStatuses as $status) {
            $delivery = new Delivery(['status' => $status]);
            $this->assertEquals($status, $delivery->status);
        }
    }

    public function test_delivery_code_format()
    {
        $delivery = new Delivery(['code' => 'DEL-20260212-ABC123']);
        
        $this->assertStringStartsWith('DEL-', $delivery->code);
        $this->assertStringContainsString('-', $delivery->code);
    }

    public function test_delivery_datetime_fields()
    {
        $delivery = new Delivery([
            'scheduled_date' => '2026-02-15',
            'scheduled_time' => '14:30:00',
        ]);

        $this->assertIsString($delivery->scheduled_date);
        $this->assertIsString($delivery->scheduled_time);
        
        // Verify date format
        $this->assertEquals(10, strlen($delivery->scheduled_date)); // YYYY-MM-DD
        $this->assertEquals(8, strlen($delivery->scheduled_time));  // HH:MM:SS
    }
}
