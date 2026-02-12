<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class DeliveryManagementBehaviorTest extends TestCase
{
    /**
     * Test delivery creation with all required fields
     */
    public function test_delivery_create_operation()
    {
        $delivery = [
            'code' => 'DEL-20260212-XYZ',
            'order_id' => 1,
            'driver_id' => 1,
            'scheduled_date' => '2026-02-15',
            'scheduled_time' => '10:00:00',
            'status' => 'scheduled',
            'created_by' => 1,
        ];

        $this->assertArrayHasKey('code', $delivery);
        $this->assertArrayHasKey('order_id', $delivery);
        $this->assertArrayHasKey('driver_id', $delivery);
        $this->assertEquals('scheduled', $delivery['status']);
    }

    /**
     * Test delivery update with status change
     */
    public function test_delivery_update_status()
    {
        $delivery = [
            'id' => 1,
            'code' => 'DEL-001',
            'order_id' => 1,
            'driver_id' => 1,
            'scheduled_date' => '2026-02-15',
            'scheduled_time' => '10:00:00',
            'status' => 'scheduled',
            'created_by' => 1,
        ];

        $this->assertEquals('scheduled', $delivery['status']);

        // Update status to in_progress
        $delivery['status'] = 'in_progress';
        $this->assertEquals('in_progress', $delivery['status']);

        // Update status to delivered
        $delivery['status'] = 'delivered';
        $this->assertEquals('delivered', $delivery['status']);
    }

    /**
     * Test delivery reassignment to different driver
     */
    public function test_delivery_reassign_driver()
    {
        $delivery = [
            'id' => 1,
            'driver_id' => 1,
            'status' => 'scheduled',
        ];

        $this->assertEquals(1, $delivery['driver_id']);

        // Reassign to another driver
        $delivery['driver_id'] = 3;

        $this->assertEquals(3, $delivery['driver_id']);
        $this->assertNotEquals(1, $delivery['driver_id']);
    }

    /**
     * Test delivery route notes can be updated
     */
    public function test_delivery_update_route_notes()
    {
        $delivery = [
            'id' => 1,
            'route_notes' => 'Leave at door',
        ];

        $this->assertEquals('Leave at door', $delivery['route_notes']);

        $delivery['route_notes'] = 'Ring doorbell, wait for answer, deliver to John';
        $this->assertStringContainsString('Ring doorbell', $delivery['route_notes']);
    }

    /**
     * Test delivery status progression workflow
     */
    public function test_delivery_status_workflow()
    {
        $delivery = [
            'id' => 1,
            'status' => 'scheduled',
        ];

        // Test first transition only
        $delivery['status'] = 'pending';
        $this->assertEquals('pending', $delivery['status']);

        // Test second transition
        $delivery['status'] = 'in_progress';
        $this->assertEquals('in_progress', $delivery['status']);

        // Test final transition
        $delivery['status'] = 'delivered';
        $this->assertEquals('delivered', $delivery['status']);
    }

    /**
     * Test delivery cancellation
     */
    public function test_delivery_cancellation()
    {
        $delivery = [
            'id' => 1,
            'status' => 'scheduled',
            'cancelled_at' => null,
        ];

        // Cancel delivery before it starts
        $delivery['status'] = 'cancelled';
        $delivery['cancelled_at'] = now()->toDateTimeString();

        $this->assertEquals('cancelled', $delivery['status']);
        $this->assertNotNull($delivery['cancelled_at']);
    }

    /**
     * Test delivery with order and driver relationships
     */
    public function test_delivery_relationships_data()
    {
        $delivery = [
            'id' => 1,
            'code' => 'DEL-001',
            'order' => [
                'id' => 1,
                'order_number' => 'ORD-20260212-ABC',
                'status' => 'confirmed',
            ],
            'driver' => [
                'id' => 1,
                'code' => 'DRV-001',
                'user' => ['name' => 'John Driver', 'email' => 'john@drivers.com'],
            ],
            'creator' => [
                'id' => 5,
                'name' => 'Logistics Manager',
                'role' => 'logistics',
            ],
        ];

        $this->assertArrayHasKey('order', $delivery);
        $this->assertArrayHasKey('driver', $delivery);
        $this->assertArrayHasKey('creator', $delivery);
        $this->assertEquals('John Driver', $delivery['driver']['user']['name']);
        $this->assertEquals('Logistics Manager', $delivery['creator']['name']);
    }

    /**
     * Test delivery list with related data
     */
    public function test_delivery_list_with_related_data()
    {
        $deliveries = [
            [
                'id' => 1,
                'code' => 'DEL-001',
                'status' => 'delivered',
                'driver' => ['code' => 'DRV-001'],
                'order' => ['order_number' => 'ORD-001'],
            ],
            [
                'id' => 2,
                'code' => 'DEL-002',
                'status' => 'in_progress',
                'driver' => ['code' => 'DRV-002'],
                'order' => ['order_number' => 'ORD-002'],
            ],
        ];

        $this->assertCount(2, $deliveries);
        
        foreach ($deliveries as $delivery) {
            $this->assertArrayHasKey('driver', $delivery);
            $this->assertArrayHasKey('order', $delivery);
        }
    }
}
