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

-- Tabela de produtos com campos extras
create table public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price numeric(12,2) not null,
  original_price numeric(12,2),
  preco_promocional numeric(12,2),
  category text,
  stock integer default 0,
  type text default 'product', -- 'product' | 'service'
  image_url text,
  images_extra text[],
  features text[],
  specifications jsonb,
  avaliacao_media float default 0,
  avaliacoes jsonb,
  nome_loja text,
  tempo_entrega text,
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

-- Tabela de biometria para login biométrico
create table if not exists public.user_biometrics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  device_id text not null,
  public_key text not null,
  platform text check (platform in ('android', 'ios')) default 'android',
  created_at timestamp default now()
);

-- Índices para performance
create index idx_products_seller_id on public.products(seller_id);
create index idx_products_category on public.products(category);
create index idx_orders_buyer_id on public.orders(buyer_id);
create index idx_orders_seller_id on public.orders(seller_id);
create index idx_user_biometrics_user_id on public.user_biometrics(user_id);