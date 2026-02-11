<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Packaged Foods
            [
                'category' => 'Packaged Foods',
                'items' => [
                    ['name' => 'Premium Corn Flakes 500g', 'price' => 5.99, 'unit' => 'box', 'stock' => 150, 'featured' => true],
                    ['name' => 'Whole Grain Oats 1kg', 'price' => 8.49, 'unit' => 'pack', 'stock' => 120],
                    ['name' => 'Canned Baked Beans 420g', 'price' => 2.49, 'unit' => 'can', 'stock' => 200],
                    ['name' => 'Canned Tuna in Olive Oil 185g', 'price' => 4.99, 'unit' => 'can', 'stock' => 180],
                    ['name' => 'Peanut Butter Smooth 500g', 'price' => 6.99, 'unit' => 'jar', 'stock' => 100],
                    ['name' => 'Chocolate Chip Cookies 250g', 'price' => 4.49, 'unit' => 'pack', 'stock' => 80, 'on_sale' => true, 'original_price' => 5.99],
                    ['name' => 'Pasta Spirals 500g', 'price' => 2.99, 'unit' => 'pack', 'stock' => 200],
                    ['name' => 'Tomato Pasta Sauce 500ml', 'price' => 3.49, 'unit' => 'jar', 'stock' => 150],
                ]
            ],
            // Beverages
            [
                'category' => 'Beverages',
                'items' => [
                    ['name' => 'Orange Juice 2L', 'price' => 6.49, 'unit' => 'bottle', 'stock' => 100, 'featured' => true],
                    ['name' => 'Spring Water 24x600ml', 'price' => 12.99, 'unit' => 'pack', 'stock' => 80],
                    ['name' => 'Cola Soft Drink 1.25L', 'price' => 2.99, 'unit' => 'bottle', 'stock' => 200],
                    ['name' => 'Green Tea Bags 100pk', 'price' => 7.99, 'unit' => 'box', 'stock' => 120],
                    ['name' => 'Ground Coffee 500g', 'price' => 14.99, 'unit' => 'pack', 'stock' => 90],
                    ['name' => 'Apple Juice 1L', 'price' => 4.49, 'unit' => 'bottle', 'stock' => 110, 'on_sale' => true, 'original_price' => 5.49],
                    ['name' => 'Energy Drink 4x250ml', 'price' => 9.99, 'unit' => 'pack', 'stock' => 150],
                ]
            ],
            // Dairy & Refrigerated
            [
                'category' => 'Dairy & Refrigerated',
                'items' => [
                    ['name' => 'Full Cream Milk 2L', 'price' => 3.99, 'unit' => 'bottle', 'stock' => 100],
                    ['name' => 'Greek Yogurt 1kg', 'price' => 7.49, 'unit' => 'tub', 'stock' => 80, 'featured' => true],
                    ['name' => 'Cheddar Cheese Block 500g', 'price' => 8.99, 'unit' => 'block', 'stock' => 60],
                    ['name' => 'Butter 500g', 'price' => 5.99, 'unit' => 'pack', 'stock' => 90],
                    ['name' => 'Free Range Eggs 12pk', 'price' => 6.99, 'unit' => 'carton', 'stock' => 120],
                    ['name' => 'Cream Cheese 250g', 'price' => 4.49, 'unit' => 'pack', 'stock' => 70],
                ]
            ],
            // Home Cleaning
            [
                'category' => 'Home Cleaning',
                'items' => [
                    ['name' => 'Laundry Detergent 2L', 'price' => 11.99, 'unit' => 'bottle', 'stock' => 100, 'featured' => true],
                    ['name' => 'Dishwashing Liquid 1L', 'price' => 4.99, 'unit' => 'bottle', 'stock' => 150],
                    ['name' => 'Multi-Surface Cleaner 750ml', 'price' => 5.49, 'unit' => 'bottle', 'stock' => 120],
                    ['name' => 'Toilet Cleaner 750ml', 'price' => 4.49, 'unit' => 'bottle', 'stock' => 100],
                    ['name' => 'Paper Towels 6pk', 'price' => 7.99, 'unit' => 'pack', 'stock' => 80, 'on_sale' => true, 'original_price' => 9.99],
                    ['name' => 'Garbage Bags 50pk', 'price' => 8.99, 'unit' => 'box', 'stock' => 90],
                ]
            ],
            // Personal Care
            [
                'category' => 'Personal Care',
                'items' => [
                    ['name' => 'Shampoo & Conditioner 750ml', 'price' => 9.99, 'unit' => 'bottle', 'stock' => 100],
                    ['name' => 'Body Wash 500ml', 'price' => 6.99, 'unit' => 'bottle', 'stock' => 120],
                    ['name' => 'Toothpaste 150g', 'price' => 4.49, 'unit' => 'tube', 'stock' => 200],
                    ['name' => 'Deodorant Roll-On 50ml', 'price' => 5.99, 'unit' => 'bottle', 'stock' => 150],
                    ['name' => 'Facial Tissues 200pk', 'price' => 3.99, 'unit' => 'box', 'stock' => 180],
                    ['name' => 'Hand Soap 500ml', 'price' => 4.99, 'unit' => 'bottle', 'stock' => 140],
                ]
            ],
            // Baby Products
            [
                'category' => 'Baby Products',
                'items' => [
                    ['name' => 'Baby Diapers Size 3 (50pk)', 'price' => 24.99, 'unit' => 'pack', 'stock' => 60],
                    ['name' => 'Baby Formula 900g', 'price' => 29.99, 'unit' => 'can', 'stock' => 40],
                    ['name' => 'Baby Wipes 80pk', 'price' => 5.99, 'unit' => 'pack', 'stock' => 100],
                    ['name' => 'Baby Food Puree 6pk', 'price' => 8.99, 'unit' => 'pack', 'stock' => 80],
                ]
            ],
            // Pet Supplies
            [
                'category' => 'Pet Supplies',
                'items' => [
                    ['name' => 'Dog Food Dry 10kg', 'price' => 45.99, 'unit' => 'bag', 'stock' => 50],
                    ['name' => 'Cat Food Wet 12x85g', 'price' => 18.99, 'unit' => 'pack', 'stock' => 70],
                    ['name' => 'Pet Treats 500g', 'price' => 9.99, 'unit' => 'pack', 'stock' => 90],
                    ['name' => 'Cat Litter 10L', 'price' => 15.99, 'unit' => 'bag', 'stock' => 60],
                ]
            ],
            // Health & Wellness
            [
                'category' => 'Health & Wellness',
                'items' => [
                    ['name' => 'Multivitamins 90 Tablets', 'price' => 19.99, 'unit' => 'bottle', 'stock' => 80],
                    ['name' => 'Vitamin C 1000mg 60 Tablets', 'price' => 14.99, 'unit' => 'bottle', 'stock' => 100],
                    ['name' => 'Fish Oil 1000mg 120 Capsules', 'price' => 24.99, 'unit' => 'bottle', 'stock' => 70],
                    ['name' => 'Protein Powder 1kg', 'price' => 39.99, 'unit' => 'tub', 'stock' => 50],
                ]
            ],
        ];

        foreach ($products as $categoryGroup) {
            $category = Category::where('name', $categoryGroup['category'])->first();
            
            if ($category) {
                foreach ($categoryGroup['items'] as $item) {
                    Product::create([
                        'category_id' => $category->id,
                        'name' => $item['name'],
                        'slug' => Str::slug($item['name']),
                        'description' => 'High quality ' . strtolower($item['name']) . ' from IslandLink ISDN.',
                        'price' => $item['price'],
                        'original_price' => $item['original_price'] ?? null,
                        'unit' => $item['unit'],
                        'stock_quantity' => $item['stock'],
                        'is_active' => true,
                        'is_featured' => $item['featured'] ?? false,
                        'is_on_sale' => $item['on_sale'] ?? false,
                    ]);
                }
            }
        }
    }
}
