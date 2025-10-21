-- Tabela de perfis de usuários
create table public.profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  phone text,
  user_type text default 'buyer', -- 'buyer' | 'seller' | 'admin'
  store_name text,
  created_at timestamptz default now(),
  primary key (id)
);

-- Tabela de produtos
create table public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price numeric(12,2) not null,
  category text,
  stock int default 0,
  type text default 'product', -- 'product' | 'service'
  image_url text,
  features text[], -- array de características
  specifications jsonb, -- objeto de especificações
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela de pedidos
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references public.profiles(id),
  seller_id uuid references public.profiles(id),
  total numeric(12,2),
  status text default 'pending', -- pending|confirmed|shipped|delivered|cancelled
  created_at timestamptz default now()
);

-- Tabela de itens do pedido
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int,
  price numeric(12,2)
);

-- Índices para performance
create index idx_products_seller_id on public.products(seller_id);
create index idx_products_category on public.products(category);
create index idx_orders_buyer_id on public.orders(buyer_id);
create index idx_orders_seller_id on public.orders(seller_id);