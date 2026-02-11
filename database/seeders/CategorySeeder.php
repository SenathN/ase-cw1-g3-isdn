<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Packaged Foods',
                'description' => 'Canned goods, snacks, cereals, and other packaged food items.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Beverages',
                'description' => 'Soft drinks, juices, water, tea, coffee, and other beverages.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Dairy & Refrigerated',
                'description' => 'Milk, cheese, yogurt, butter, and refrigerated products.',
                'sort_order' => 3,
            ],
            [
                'name' => 'Home Cleaning',
                'description' => 'Detergents, cleaning supplies, and household products.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Personal Care',
                'description' => 'Toiletries, hygiene products, and personal care items.',
                'sort_order' => 5,
            ],
            [
                'name' => 'Baby Products',
                'description' => 'Baby food, diapers, and baby care essentials.',
                'sort_order' => 6,
            ],
            [
                'name' => 'Pet Supplies',
                'description' => 'Pet food and pet care products.',
                'sort_order' => 7,
            ],
            [
                'name' => 'Health & Wellness',
                'description' => 'Vitamins, supplements, and health products.',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'sort_order' => $category['sort_order'],
                'is_active' => true,
            ]);
        }
    }
}
