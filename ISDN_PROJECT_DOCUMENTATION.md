# IslandLink Sales Distribution Network (ISDN) - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Work Distribution](#work-distribution)
5. [Database Schema](#database-schema)
6. [Use Cases](#use-cases)
7. [Class Structure](#class-structure)
8. [Development Workflow](#development-workflow)
9. [Sprint Plan](#sprint-plan)
10. [Testing Strategy](#testing-strategy)

---

## Project Overview

### Business Context
**IslandLink Sales Distribution Network (ISDN)** is a wholesale and retail distribution company serving:
- **5,000+ retail outlets** across the island
- **5 Regional Distribution Centres (RDCs)**: North, South, East, West, Central
- **Product Range**: Fast-Moving Consumer Goods (FMCG) - packaged foods, beverages, home cleaning products, personal care items

### Current Problems
1. **Manual Order Processing** - Phone/email orders manually entered into Excel, high error rate
2. **No Real-time Inventory** - Weekly updates only, frequent stock discrepancies
3. **No Delivery Tracking** - Manual scheduling, no GPS, customers have no visibility
4. **Manual Billing** - Invoices generated manually, cash/cheque collection at delivery
5. **Delayed Reporting** - Monthly manual reports, no real-time business insights

### Solution
A **Centralized Web-based Distribution Management System** with:
- Real-time order management portal
- Real-time inventory synchronization across all RDCs
- GPS-based delivery tracking
- Automated invoice generation and online payments
- Real-time analytics dashboard
- Role-based access for all user types

---

## Technology Stack

### Architecture Type
**Monolithic Laravel Application with Inertia.js + React Frontend**

This is NOT a separate frontend + backend API architecture. Instead:
- Laravel handles routing, controllers, business logic, and database
- React components render the UI (no Blade templates)
- Inertia.js bridges Laravel and React seamlessly
- No REST API needed for most operations
- Frontend lives inside the Laravel project

### Core Technologies

```
Backend Framework: Laravel 10+
Frontend Framework: React 18+
Bridge/Glue: Inertia.js
Authentication: Laravel Breeze (with React scaffolding)
Database: SQLite
ORM: Eloquent (Laravel's built-in ORM)
Build Tool: Vite
Package Manager: npm (frontend), Composer (backend)
Styling: Tailwind CSS (included with Breeze)
```

### Key Packages

**Laravel Backend:**
```bash
# Core
laravel/framework: ^10.0
laravel/breeze: ^1.0 (includes Inertia + React)
inertiajs/inertia-laravel: ^0.6

# Additional
barryvdh/laravel-dompdf: PDF generation
laravel/sanctum: API tokens (if needed)
spatie/laravel-permission: Role management (optional)
```

**React Frontend:**
```bash
# Core
react: ^18.0
react-dom: ^18.0
@inertiajs/react: ^1.0

# UI & Utilities
@headlessui/react: Accessible UI components
@heroicons/react: Icons
axios: HTTP client
react-google-maps/api: Google Maps integration
stripe/stripe-js: Payment gateway
chart.js / recharts: Analytics charts
```

### External Services
- **Payment Gateway**: Stripe API or PayPal
- **Email Service**: SendGrid or Mailgun (Laravel Mail)
- **SMS**: Twilio (optional)
- **Maps/GPS**: Google Maps API
- **PDF Generation**: Laravel DomPDF

---

## System Architecture

### 3-Tier Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER                         │
│         (React Components via Inertia.js)               │
│  resources/js/Pages/                                    │
│  resources/js/Components/                               │
│  resources/js/Layouts/                                  │
└─────────────────────────────────────────────────────────┘
                        ↕ (Inertia.js)
┌─────────────────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER                         │
│              (Laravel Backend)                          │
│  routes/web.php                                         │
│  app/Http/Controllers/                                  │
│  app/Services/                                          │
│  app/Models/ (Eloquent ORM)                             │
│  app/Http/Middleware/                                   │
└─────────────────────────────────────────────────────────┘
                        ↕ (Eloquent ORM)
┌─────────────────────────────────────────────────────────┐
│                  DATA LAYER                             │
│              (SQLite Database)                          │
│  database/database.sqlite                               │
│  database/migrations/                                   │
│  database/seeders/                                      │
└─────────────────────────────────────────────────────────┘
```

### How It Works

1. **User visits a page** → `/dashboard`
2. **Laravel route** → `Route::get('/dashboard', [DashboardController::class, 'index'])`
3. **Controller returns Inertia** → `return Inertia::render('Dashboard', ['user' => $user])`
4. **Inertia loads React component** → `resources/js/Pages/Dashboard.jsx`
5. **React renders UI** → Receives `user` as prop

**No page refresh. Feels like a Single Page Application (SPA).**

### Folder Structure

```
isdn-project/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Customer/          # Member 1
│   │   │   ├── RDCStaff/          # Member 2
│   │   │   ├── Admin/             # Member 2
│   │   │   ├── Logistics/         # Member 3
│   │   │   └── Accounts/          # Member 3
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Order.php
│   │   ├── Inventory.php
│   │   ├── Delivery.php
│   │   ├── Invoice.php
│   │   └── ... (all other models)
│   └── Services/
│       ├── CartService.php
│       ├── OrderService.php
│       ├── InventoryService.php
│       ├── PaymentService.php
│       └── RouteOptimizationService.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── database.sqlite
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Auth/              # Breeze auth pages
│   │   │   ├── Customer/          # Member 1
│   │   │   ├── RDCStaff/          # Member 2
│   │   │   ├── Admin/             # Member 2
│   │   │   ├── Logistics/         # Member 3
│   │   │   └── Accounts/          # Member 3
│   │   ├── Components/            # Shared components
│   │   └── Layouts/               # Layout components
│   └── css/
│       └── app.css                # Tailwind CSS
├── routes/
│   ├── web.php                    # All routes
│   └── auth.php                   # Breeze auth routes
├── public/
│   └── build/                     # Compiled assets (generated)
├── package.json                   # npm dependencies
├── composer.json                  # PHP dependencies
├── vite.config.js                 # Vite configuration
└── .env                           # Environment variables
```

---

## Work Distribution

### Team Structure: 3 Members

Each member is responsible for specific user roles/components:

### **MEMBER 1: Customer Component**
**Role Focus**: Customer-facing features

**Components to Build:**

1. **Authentication** (using Breeze scaffolding)
   - Register page customization
   - Login page customization
   - Password reset
   - Profile management

2. **Product Browsing**
   - `Pages/Customer/Products/Index.jsx` - Product catalog
   - `Pages/Customer/Products/Show.jsx` - Product details
   - Search and filter functionality
   - Promotions display

3. **Shopping Cart & Orders**
   - `Pages/Customer/Cart.jsx` - Shopping cart
   - `Pages/Customer/Checkout.jsx` - Checkout process
   - `Pages/Customer/Orders/Index.jsx` - Order history
   - `Pages/Customer/Orders/Show.jsx` - Order details

4. **Tracking & Payments**
   - `Pages/Customer/Tracking.jsx` - Real-time delivery tracking
   - `Pages/Customer/Invoices/Index.jsx` - Invoice list
   - `Pages/Customer/Payments/Process.jsx` - Payment interface

**Controllers:**
```php
app/Http/Controllers/Customer/
├── ProductController.php
├── CartController.php
├── OrderController.php
├── PaymentController.php
└── ProfileController.php
```

**Services:**
```php
app/Services/
├── CartService.php
└── OrderService.php (shared with Member 2)
```

**Models** (shared with other members):
- User, Product, Cart, CartItem, Order, OrderItem

---

### **MEMBER 2: RDC Staff & Admin Component**
**Role Focus**: Inventory management, order processing, administration

**Components to Build:**

1. **Admin Panel**
   - `Pages/Admin/Dashboard.jsx` - Admin dashboard
   - `Pages/Admin/Users/Index.jsx` - User management
   - `Pages/Admin/Users/Create.jsx` - Create user
   - `Pages/Admin/Reports.jsx` - Reports dashboard

2. **RDC Staff Interface**
   - `Pages/RDCStaff/Dashboard.jsx` - Staff dashboard
   - `Pages/RDCStaff/Products/Index.jsx` - Product list
   - `Pages/RDCStaff/Products/Create.jsx` - Add product
   - `Pages/RDCStaff/Products/Edit.jsx` - Edit product

3. **Inventory Management**
   - `Pages/RDCStaff/Inventory/Index.jsx` - Real-time inventory view
   - `Pages/RDCStaff/Inventory/Update.jsx` - Update stock
   - `Pages/RDCStaff/StockTransfers/Index.jsx` - Stock transfers
   - `Pages/RDCStaff/StockTransfers/Create.jsx` - Initiate transfer

4. **Order Processing**
   - `Pages/RDCStaff/Orders/Index.jsx` - Incoming orders
   - `Pages/RDCStaff/Orders/Process.jsx` - Process order

**Controllers:**
```php
app/Http/Controllers/Admin/
├── UserController.php
├── ReportController.php
└── DashboardController.php

app/Http/Controllers/RDCStaff/
├── ProductController.php
├── InventoryController.php
├── StockTransferController.php
└── OrderProcessingController.php
```

**Services:**
```php
app/Services/
├── InventoryService.php
├── StockTransferService.php
└── ReportService.php
```

**Models**:
- Product, Category, Inventory, StockTransfer, StockMovement, Order

---

### **MEMBER 3: Logistics & Accounts Component**
**Role Focus**: Delivery management, billing, payments

**Components to Build:**

1. **Logistics Interface**
   - `Pages/Logistics/Dashboard.jsx` - Logistics dashboard
   - `Pages/Logistics/Deliveries/Index.jsx` - Delivery list
   - `Pages/Logistics/Deliveries/Schedule.jsx` - Schedule delivery
   - `Pages/Logistics/Routes/Optimize.jsx` - Route optimization
   - `Pages/Logistics/Drivers/Index.jsx` - Driver management
   - `Pages/Logistics/Tracking/Map.jsx` - GPS tracking map

2. **Driver Interface**
   - `Pages/Driver/Dashboard.jsx` - Driver dashboard
   - `Pages/Driver/MyDeliveries.jsx` - Assigned deliveries

3. **Accounts Interface**
   - `Pages/Accounts/Dashboard.jsx` - Accounts dashboard
   - `Pages/Accounts/Invoices/Index.jsx` - Invoice list
   - `Pages/Accounts/Invoices/Generate.jsx` - Generate invoice
   - `Pages/Accounts/Payments/Index.jsx` - Payment list
   - `Pages/Accounts/Payments/Record.jsx` - Record payment
   - `Pages/Accounts/Payments/Reconcile.jsx` - Reconcile payments

**Controllers:**
```php
app/Http/Controllers/Logistics/
├── DeliveryController.php
├── RouteController.php
├── DriverController.php
└── TrackingController.php

app/Http/Controllers/Accounts/
├── InvoiceController.php
└── PaymentController.php

app/Http/Controllers/Driver/
└── DashboardController.php
```

**Services:**
```php
app/Services/
├── DeliveryService.php
├── RouteOptimizationService.php
├── InvoiceService.php
├── PaymentService.php
└── NotificationService.php
```

**Models**:
- Delivery, Route, Vehicle, Driver, DeliveryTracking, Invoice, Payment

---

### Shared Responsibilities (All Members)

**Group Tasks:**

1. **Software Development Methodology**
   - Selected: **Agile Scrum**
   - 2-week sprints
   - Daily standups
   - Sprint reviews and retrospectives

2. **Requirements Documentation**
   - Functional Requirements (FR-001 to FR-010)
   - Non-Functional Requirements (NFR-001 to NFR-008)

3. **UML Diagrams**
   - Use Case Diagram (all user roles)
   - Class Diagram (all models and relationships)
   - 3-Tier Architecture Diagram
   - ER Diagram

4. **Project Plan**
   - Gantt chart
   - Sprint planning
   - Milestones
   - Risk assessment

5. **User Manuals**
   - Customer manual (Member 1)
   - RDC Staff & Admin manual (Member 2)
   - Logistics & Accounts manual (Member 3)

---

## Database Schema

### Core Tables

#### 1. users (Laravel Breeze)
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'rdc_staff', 'admin', 'logistics', 'driver', 'accounts') NOT NULL,
    phone VARCHAR(20),
    remember_token VARCHAR(100),
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. categories
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. products
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

#### 4. inventories
```sql
CREATE TABLE inventories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    rdc_location ENUM('North', 'South', 'East', 'West', 'Central') NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_rdc (product_id, rdc_location)
);
```

#### 5. stock_movements
```sql
CREATE TABLE stock_movements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    inventory_id BIGINT NOT NULL,
    movement_type ENUM('sale', 'return', 'damage', 'transfer_in', 'transfer_out') NOT NULL,
    quantity INTEGER NOT NULL,
    reference_id BIGINT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventories(id) ON DELETE CASCADE
);
```

#### 6. stock_transfers
```sql
CREATE TABLE stock_transfers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    from_rdc ENUM('North', 'South', 'East', 'West', 'Central') NOT NULL,
    to_rdc ENUM('North', 'South', 'East', 'West', 'Central') NOT NULL,
    quantity INTEGER NOT NULL,
    status ENUM('pending', 'approved', 'in_transit', 'completed') DEFAULT 'pending',
    initiated_by BIGINT NOT NULL,
    approved_by BIGINT,
    transfer_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (initiated_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);
```

#### 7. carts
```sql
CREATE TABLE carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 8. cart_items
```sql
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### 9. orders
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    rdc_location ENUM('North', 'South', 'East', 'West', 'Central') NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    estimated_delivery_date DATE,
    processed_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
```

#### 10. order_items
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### 11. vehicles
```sql
CREATE TABLE vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(100),
    capacity DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 12. routes
```sql
CREATE TABLE routes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    route_name VARCHAR(255) NOT NULL,
    rdc_location ENUM('North', 'South', 'East', 'West', 'Central') NOT NULL,
    optimized_path JSON,
    total_distance DECIMAL(10, 2),
    estimated_duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 13. deliveries
```sql
CREATE TABLE deliveries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    route_id BIGINT,
    scheduled_date DATE NOT NULL,
    status ENUM('scheduled', 'in_transit', 'delivered', 'failed') DEFAULT 'scheduled',
    estimated_time TIME,
    actual_delivery_time TIMESTAMP,
    proof_of_delivery TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (driver_id) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);
```

#### 14. delivery_tracking
```sql
CREATE TABLE delivery_tracking (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    delivery_id BIGINT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
);
```

#### 15. invoices
```sql
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    pdf_path VARCHAR(500),
    status ENUM('pending', 'sent', 'paid', 'overdue') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

#### 16. payments
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    invoice_id BIGINT NOT NULL,
    payment_method ENUM('online', 'cash', 'cheque', 'bank_transfer') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    processed_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);
```

#### 17. promotions
```sql
CREATE TABLE promotions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 18. notifications
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('order', 'delivery', 'payment', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Database Relationships

```
users 1:N orders
users 1:1 carts
users 1:N notifications
categories 1:N products
products 1:N inventories
products 1:N order_items
products 1:N cart_items
carts 1:N cart_items
orders 1:N order_items
orders 1:1 deliveries
orders 1:1 invoices
inventories 1:N stock_movements
deliveries 1:N delivery_tracking
invoices 1:N payments
```

---

## Use Cases

### Customer Use Cases (Member 1)
1. **Register Account** - Customer creates an account
2. **Login** - Customer authenticates
3. **Browse Products** - Customer views product catalog by category
4. **Search Products** - Customer searches for specific products
5. **View Product Details** - Customer sees detailed product info
6. **View Promotions** - Customer sees current offers
7. **Add to Cart** - Customer adds products to shopping cart
8. **Place Order** - Customer completes checkout
9. **View Order History** - Customer sees past orders
10. **Track Delivery** - Customer tracks order in real-time
11. **View Invoice** - Customer views invoice details
12. **Make Payment** - Customer pays online
13. **View Payment History** - Customer sees payment records

### RDC Staff Use Cases (Member 2)
14. **Login** - Staff authenticates
15. **Manage Products** - Add/edit/delete products
16. **Manage Categories** - Organize product categories
17. **View Real-time Inventory** - Check stock across all RDCs
18. **Update Stock Levels** - Record sales, returns, damages
19. **Initiate Stock Transfer** - Transfer stock between RDCs
20. **Track Stock Movements** - Monitor inventory changes
21. **View Incoming Orders** - See customer orders
22. **Process Orders** - Confirm and prepare orders
23. **Update Order Status** - Change order workflow status

### Admin Use Cases (Member 2)
24. **Manage Users** - Create/edit/delete user accounts
25. **Assign Roles** - Set user permissions
26. **View Sales Analytics** - Real-time sales dashboard
27. **View Inventory Reports** - Stock turnover analysis
28. **Generate Custom Reports** - Create specific reports

### Logistics Officer Use Cases (Member 3)
29. **View Pending Deliveries** - See deliveries to schedule
30. **Create Delivery Schedule** - Plan delivery routes
31. **Optimize Routes** - Calculate best delivery paths
32. **Assign Drivers** - Assign drivers to routes
33. **Manage Drivers** - Driver information management
34. **Track GPS** - Monitor deliveries in real-time
35. **Update Delivery Status** - Change delivery progress
36. **View Delivery Performance** - Analyze delivery metrics

### Driver Use Cases (Member 3)
37. **View Assigned Deliveries** - See today's deliveries
38. **Update Delivery Status** - Mark deliveries complete
39. **Record Proof of Delivery** - Document delivery completion

### Accounts Staff Use Cases (Member 3)
40. **Generate Invoices** - Auto-create invoices
41. **Email Invoices** - Send invoices to customers
42. **Process Online Payments** - Handle payment gateway
43. **Record Manual Payments** - Enter cash/cheque payments
44. **Reconcile Payments** - Match payments to invoices
45. **Track Payment Status** - Monitor payment state
46. **View Outstanding Payments** - See unpaid invoices

---

## Class Structure

### Laravel Models (Eloquent ORM)

#### User.php
```php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password', 'role', 'phone'];
    protected $hidden = ['password', 'remember_token'];

    // Relationships
    public function orders() { return $this->hasMany(Order::class); }
    public function cart() { return $this->hasOne(Cart::class); }
    public function notifications() { return $this->hasMany(Notification::class); }
    
    // Methods
    public function hasRole($role) { return $this->role === $role; }
}
```

#### Product.php
```php
namespace App\Models;

class Product extends Model
{
    protected $fillable = ['category_id', 'name', 'description', 'price', 'image_url', 'is_active'];

    // Relationships
    public function category() { return $this->belongsTo(Category::class); }
    public function inventories() { return $this->hasMany(Inventory::class); }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
    public function cartItems() { return $this->hasMany(CartItem::class); }
}
```

#### Order.php
```php
namespace App\Models;

class Order extends Model
{
    protected $fillable = ['user_id', 'order_number', 'rdc_location', 'status', 'total_amount', 'estimated_delivery_date', 'processed_by'];

    // Relationships
    public function user() { return $this->belongsTo(User::class); }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
    public function delivery() { return $this->hasOne(Delivery::class); }
    public function invoice() { return $this->hasOne(Invoice::class); }
    public function processedBy() { return $this->belongsTo(User::class, 'processed_by'); }
    
    // Methods
    public function confirm() { $this->update(['status' => 'confirmed']); }
    public function cancel() { $this->update(['status' => 'cancelled']); }
}
```

#### Inventory.php
```php
namespace App\Models;

class Inventory extends Model
{
    protected $fillable = ['product_id', 'rdc_location', 'quantity', 'last_updated'];

    // Relationships
    public function product() { return $this->belongsTo(Product::class); }
    public function stockMovements() { return $this->hasMany(StockMovement::class); }
    
    // Methods
    public function updateStock($quantity, $movementType) {
        $this->quantity += $quantity;
        $this->save();
        $this->stockMovements()->create([
            'movement_type' => $movementType,
            'quantity' => $quantity
        ]);
    }
}
```

#### Delivery.php
```php
namespace App\Models;

class Delivery extends Model
{
    protected $fillable = ['order_id', 'driver_id', 'vehicle_id', 'route_id', 'scheduled_date', 'status', 'estimated_time'];

    // Relationships
    public function order() { return $this->belongsTo(Order::class); }
    public function driver() { return $this->belongsTo(User::class, 'driver_id'); }
    public function vehicle() { return $this->belongsTo(Vehicle::class); }
    public function route() { return $this->belongsTo(Route::class); }
    public function trackings() { return $this->hasMany(DeliveryTracking::class); }
    
    // Methods
    public function updateStatus($status) { $this->update(['status' => $status]); }
}
```

#### Invoice.php
```php
namespace App\Models;

class Invoice extends Model
{
    protected $fillable = ['order_id', 'invoice_number', 'amount', 'invoice_date', 'due_date', 'pdf_path', 'status'];

    // Relationships
    public function order() { return $this->belongsTo(Order::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    
    // Methods
    public function generatePDF() { /* PDF generation logic */ }
    public function sendEmail() { /* Email sending logic */ }
    public function markAsPaid() { $this->update(['status' => 'paid']); }
}
```

---

## Development Workflow

### Initial Setup

```bash
# 1. Install Laravel with Breeze
composer create-project laravel/laravel isdn-project
cd isdn-project

# 2. Install Breeze with React
composer require laravel/breeze --dev
php artisan breeze:install react

# 3. Install dependencies
npm install
composer install

# 4. Configure database (SQLite)
# Edit .env file:
# DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# Create database file
touch database/database.sqlite

# 5. Run migrations
php artisan migrate

# 6. Start development servers
php artisan serve          # Terminal 1 - Laravel
npm run dev                # Terminal 2 - Vite (React)
```

### Daily Development Workflow

**For Frontend Work (React):**
```bash
# Work in: resources/js/Pages/ and resources/js/Components/
# Hot reload is automatic with npm run dev
```

**For Backend Work (Laravel):**
```bash
# Create controller
php artisan make:controller Customer/ProductController

# Create model with migration
php artisan make:model Product -m

# Create service
# Manually create in app/Services/

# Run migration
php artisan migrate
```

### Creating a New Feature (Example: Product Browsing)

**Step 1: Create Migration**
```bash
php artisan make:migration create_products_table
```

**Step 2: Define Migration**
```php
// database/migrations/xxxx_create_products_table.php
public function up() {
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->foreignId('category_id')->constrained();
        $table->string('name');
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2);
        $table->string('image_url')->nullable();
        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}
```

**Step 3: Run Migration**
```bash
php artisan migrate
```

**Step 4: Create Model**
```php
// app/Models/Product.php
class Product extends Model {
    protected $fillable = ['category_id', 'name', 'description', 'price', 'image_url', 'is_active'];
    
    public function category() {
        return $this->belongsTo(Category::class);
    }
}
```

**Step 5: Create Controller**
```php
// app/Http/Controllers/Customer/ProductController.php
namespace App\Http\Controllers\Customer;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index() {
        $products = Product::with('category')
            ->where('is_active', true)
            ->paginate(20);
            
        return Inertia::render('Customer/Products/Index', [
            'products' => $products
        ]);
    }
    
    public function show(Product $product) {
        return Inertia::render('Customer/Products/Show', [
            'product' => $product->load('category')
        ]);
    }
}
```

**Step 6: Define Routes**
```php
// routes/web.php
use App\Http\Controllers\Customer\ProductController;

Route::middleware('auth')->group(function () {
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
});
```

**Step 7: Create React Component**
```jsx
// resources/js/Pages/Customer/Products/Index.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, products }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Products" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-6">Products</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.data.map(product => (
                            <Link 
                                key={product.id} 
                                href={route('products.show', product.id)}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg"
                            >
                                <img 
                                    src={product.image_url || '/placeholder.jpg'} 
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded"
                                />
                                <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
                                <p className="text-gray-600 mt-2">{product.description}</p>
                                <p className="text-2xl font-bold mt-2">${product.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
```

### Using Inertia Forms

```jsx
// Example: Add to Cart
import { useForm } from '@inertiajs/react';

export default function ProductShow({ product }) {
    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantity: 1
    });
    
    const handleAddToCart = (e) => {
        e.preventDefault();
        post(route('cart.add'), {
            onSuccess: () => {
                alert('Added to cart!');
            }
        });
    };
    
    return (
        <form onSubmit={handleAddToCart}>
            <input 
                type="number" 
                value={data.quantity}
                onChange={e => setData('quantity', e.target.value)}
                min="1"
            />
            <button type="submit" disabled={processing}>
                Add to Cart
            </button>
        </form>
    );
}
```

---

## Sprint Plan

### Total Duration: 16 Weeks (8 Sprints x 2 weeks each)

### Sprint 1-2 (Weeks 1-4): Foundation & Authentication

**All Members:**
- Project setup
- Database design
- UML diagrams
- Requirements documentation

**Member 1:**
- Customize Breeze auth pages (Login, Register, Password Reset)
- Customer profile management
- Basic product browsing UI structure

**Member 2:**
- Database migrations for all tables
- Seed initial data (categories, products)
- Admin dashboard structure
- Role-based middleware

**Member 3:**
- System architecture documentation
- External API setup (Stripe, Google Maps)
- Notification service foundation

### Sprint 3-4 (Weeks 5-8): Product Catalog & Orders

**Member 1:**
- Product browsing with filters
- Product search functionality
- Shopping cart implementation
- Checkout process
- Order placement

**Member 2:**
- Product management (CRUD)
- Real-time inventory sync logic
- Order processing interface for RDC staff
- Stock availability checks

**Member 3:**
- Automated invoice generation
- PDF invoice creation
- Email invoice delivery
- Payment gateway integration (frontend)

### Sprint 5-6 (Weeks 9-12): Inventory & Delivery

**Member 1:**
- Order history page
- Delivery tracking interface
- Customer notifications

**Member 2:**
- Stock level updates
- Inter-branch stock transfers
- Stock movement tracking
- Low stock alerts
- Inventory reports

**Member 3:**
- Delivery scheduling
- Route optimization algorithm
- Driver assignment
- GPS tracking integration
- Delivery status updates

### Sprint 7-8 (Weeks 13-16): Analytics, Payments & Final Integration

**Member 1:**
- Payment processing (customer side)
- Invoice viewing
- Payment history
- Mobile responsiveness
- Customer user manual

**Member 2:**
- Sales analytics dashboard
- Custom report generator
- User management for admin
- Staff user manual
- Final integration testing

**Member 3:**
- Payment gateway backend
- Manual payment recording
- Payment reconciliation
- Delivery performance metrics
- Driver interface
- Logistics user manual
- End-to-end testing

---

## Testing Strategy

### Unit Testing (All Members)

**Laravel Tests:**
```bash
# Create test
php artisan make:test ProductTest

# Run tests
php artisan test
```

**Example Test:**
```php
// tests/Feature/ProductTest.php
public function test_customer_can_view_products() {
    $user = User::factory()->create(['role' => 'customer']);
    
    $response = $this->actingAs($user)->get('/products');
    
    $response->assertStatus(200);
}
```

**React Tests:**
```bash
# Install Jest and React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Member-Specific Testing

**Member 1:**
- Login/registration functionality
- Product browsing and search
- Cart operations (add, remove, update)
- Checkout process
- Order placement
- Payment integration
- Mobile responsiveness

**Member 2:**
- Product CRUD operations
- Inventory synchronization
- Stock transfers between RDCs
- Order processing workflow
- Report generation accuracy
- Database integrity
- Concurrent access handling

**Member 3:**
- Delivery scheduling logic
- Route optimization algorithm
- GPS tracking accuracy
- Invoice generation
- Payment gateway integration
- Payment reconciliation
- Email delivery
- PDF generation
- Performance under load

### Integration Testing (All Members)

Test complete workflows:
1. Customer places order → RDC processes → Logistics schedules → Driver delivers → Payment processed
2. Stock transfer initiated → Approved → Inventory updated across RDCs
3. Order placed → Invoice generated → Email sent → Payment received → Invoice marked paid

### User Acceptance Testing

- Create test scenarios based on use cases
- Conduct testing with stakeholders
- Gather feedback
- Fix bugs and improve UX

---

## Requirements Specification

### Functional Requirements

**FR-001**: User Authentication & Authorization
- System shall provide secure login for all user types
- System shall implement role-based access control
- System shall support password reset functionality

**FR-002**: Product Catalog Management
- Customers shall browse products by category
- Customers shall search products by name/description
- RDC Staff shall add/edit/delete products

**FR-003**: Order Management
- Customers shall place orders online
- System shall provide instant order confirmation
- RDC Staff shall process and manage orders

**FR-004**: Real-Time Inventory Tracking
- System shall synchronize inventory across all RDCs in real-time
- System shall track stock movements (sales, returns, damages)
- System shall support inter-branch stock transfers

**FR-005**: Delivery Scheduling & Tracking
- System shall optimize delivery routes
- System shall integrate GPS for real-time tracking
- Logistics officers shall assign drivers to routes

**FR-006**: Automated Billing
- System shall auto-generate invoices upon order confirmation
- System shall email digital invoices to customers
- System shall create PDF format invoices

**FR-007**: Payment Processing
- System shall integrate online payment gateway
- Accounts staff shall record manual payments
- System shall track payment status

**FR-008**: Reporting & Analytics
- System shall provide real-time sales analytics
- System shall generate inventory reports
- System shall track delivery performance metrics

**FR-009**: Notifications
- System shall send order confirmation notifications
- System shall send delivery status updates
- System shall send invoice notifications

**FR-010**: Mobile Responsiveness
- System shall be accessible on mobile devices
- System shall provide responsive design for all screen sizes

### Non-Functional Requirements

**NFR-001**: Performance
- Page load time < 3 seconds
- Support 10,000+ concurrent users
- Real-time inventory updates within 2 seconds

**NFR-002**: Security
- SSL/TLS encryption for data transmission
- Secure password storage (bcrypt hashing)
- PCI-DSS compliant payment processing
- CSRF protection

**NFR-003**: Reliability
- System uptime 99.5%
- Automated daily data backups
- Disaster recovery plan

**NFR-004**: Scalability
- Horizontal scaling capability
- Support for additional RDCs
- Database optimization for growth

**NFR-005**: Usability
- Intuitive user interface
- Contextual help
- Clear error messages

**NFR-006**: Maintainability
- Modular code architecture
- Comprehensive documentation
- Easy updates and patches

**NFR-007**: Compatibility
- Support major browsers (Chrome, Firefox, Safari, Edge)
- Compatible with Android and iOS devices
- API support for third-party integrations

**NFR-008**: Availability
- 24/7 availability except scheduled maintenance
- Failover mechanisms
- Scheduled maintenance windows communicated in advance

---

## Key Commands Reference

### Laravel Commands
```bash
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Create migration
php artisan make:migration create_products_table

# Create model with migration
php artisan make:model Product -m

# Create controller
php artisan make:controller ProductController

# Create seeder
php artisan make:seeder ProductSeeder

# Run seeders
php artisan db:seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Run tests
php artisan test
```

### NPM Commands
```bash
# Install dependencies
npm install

# Development (hot reload)
npm run dev

# Production build
npm run build

# Run tests
npm test
```

### Git Workflow
```bash
# Create branch for your component
git checkout -b feature/customer-product-browsing

# Add and commit changes
git add .
git commit -m "Add product browsing functionality"

# Push to remote
git push origin feature/customer-product-browsing

# Create pull request on GitHub/GitLab
```

---

## Project Milestones

1. **Week 2**: Requirements & Design Complete
2. **Week 4**: Authentication & Basic Structure Complete
3. **Week 8**: Product Catalog & Order Management Complete
4. **Week 10**: Inventory System Complete
5. **Week 14**: Delivery & Billing Complete
6. **Week 16**: Testing, Documentation & Deployment Complete

---

## Important Notes for AI Agents

1. **This is NOT a REST API project** - Do not create separate API routes. Use Inertia.js to pass data from Laravel controllers to React components.

2. **Authentication is handled by Laravel Breeze** - Do not create custom auth from scratch. Customize the existing Breeze React components.

3. **All React components receive data as props** - Data comes from Laravel controllers via Inertia, not from API calls.

4. **Use Inertia's useForm hook for forms** - Don't use axios directly for form submissions. Use Inertia's built-in form handling.

5. **SQLite is single-file** - No separate database server needed. File is at `database/database.sqlite`.

6. **Real-time features** - For inventory sync and GPS tracking, consider Laravel Echo + Pusher or Laravel Reverb for WebSockets.

7. **File uploads** - Store product images in `public/storage/products/` and create symbolic link: `php artisan storage:link`

8. **Role middleware** - Create custom middleware to check user roles: `RoleMiddleware.php`

9. **PDF generation** - Use `barryvdh/laravel-dompdf` package for invoice PDFs.

10. **Payment gateway** - Stripe test mode for development. Never commit real API keys to Git.

---

## Success Criteria

The project is complete when:

✅ All user roles can login and access their respective dashboards
✅ Customers can browse, search, and order products
✅ Real-time inventory updates work across all RDCs
✅ Orders are processed by RDC staff and assigned to logistics
✅ GPS tracking shows live delivery locations
✅ Invoices are auto-generated and emailed
✅ Online payments work through payment gateway
✅ All reports and analytics display accurate real-time data
✅ Mobile responsive design works on all devices
✅ All tests pass (unit, integration, UAT)
✅ User manuals are complete for all user types
✅ System meets all performance and security requirements

---

**Project Start Date**: [To be determined]
**Expected Completion**: 16 weeks from start date
**Team Size**: 3 developers
**Methodology**: Agile Scrum (2-week sprints)
