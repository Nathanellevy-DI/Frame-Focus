-- Table for Art Prints (Products)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL, -- Serves as the base "starting at" price.
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Print',
  is_available BOOLEAN DEFAULT TRUE

);

-- Table for Print Sizes (Variants)
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size_name TEXT NOT NULL, -- e.g., '10x10', '24x36'
  price DECIMAL(10, 2) NOT NULL,
  printful_sync_variant_id TEXT, -- e.g., '5247147021'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL, -- Track the exact size purchased
  quantity INTEGER DEFAULT 1,
  price_at_purchase DECIMAL(10, 2) NOT NULL
);
