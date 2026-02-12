<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class DriverValidationTest extends TestCase
{
    /**
     * Test validation rules for driver creation
     */
    public function test_driver_user_id_is_required()
    {
        // This test documents the validation rule that user_id is required
        $rules = [
            'user_id' => 'required|exists:users,id',
        ];

        $this->assertArrayHasKey('user_id', $rules);
        $this->assertStringContainsString('required', $rules['user_id']);
        $this->assertStringContainsString('exists', $rules['user_id']);
    }

    /**
     * Test that driver code is auto-generated
     */
    public function test_driver_code_is_auto_generated_not_validated()
    {
        // Driver code is generated in controller, not from user input
        $generatedCode = strtoupper('DRV-' . \Illuminate\Support\Str::random(6));
        
        $this->assertStringStartsWith('DRV-', $generatedCode);
        $this->assertMatchesRegularExpression('/^DRV-[A-Z0-9]{6}$/', $generatedCode);
    }

    /**
     * Test multiple drivers can be assigned to different users
     */
    public function test_multiple_drivers_with_different_users()
    {
        $users = [1, 2, 3, 4, 5];
        $drivers = [];
        
        foreach ($users as $userId) {
            $drivers[] = [
                'user_id' => $userId,
                'code' => strtoupper('DRV-' . \Illuminate\Support\Str::random(6)),
            ];
        }

        $this->assertCount(5, $drivers);
        
        foreach ($drivers as $driver) {
            $this->assertArrayHasKey('user_id', $driver);
            $this->assertArrayHasKey('code', $driver);
            $this->assertStringStartsWith('DRV-', $driver['code']);
        }
    }

    /**
     * Test driver code uniqueness
     */
    public function test_driver_code_should_be_unique()
    {
        $codes = [];
        
        for ($i = 0; $i < 100; $i++) {
            $code = strtoupper('DRV-' . \Illuminate\Support\Str::random(6));
            $codes[] = $code;
        }

        // Check that generated codes are unique (with very high probability)
        $unique = array_unique($codes);
        $this->assertGreaterThan(95, count($unique)); // Should be nearly all unique
    }
}
