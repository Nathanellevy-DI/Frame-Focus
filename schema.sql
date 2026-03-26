-- Table for Art Prints (Products)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Print',
  is_available BOOLEAN DEFAULT TRUE
);

-- Table for Orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  shipping_address TEXT,
  phone_number TEXT,
  tracking_number TEXT,
  stripe_session_id TEXT UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_speed TEXT DEFAULT 'Standard',
  status TEXT DEFAULT 'pending' -- e.g., 'pending', 'paid', 'shipped'
);

-- Join Table for Order Items (to see what was in each order)
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);
