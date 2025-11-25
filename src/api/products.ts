import { Product, ProductVariant } from "../types/product";
import { supabase } from '@/integrations/supabase/client';

// Tipagem para o Banner (baseado no componente BannerCarousel)
interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string; // Alterado para link_url
  active: boolean;
}

// Função auxiliar para mapear dados do Supabase para o tipo Product
const mapSupabaseProductToFrontend = (product: any): Product => {
  const variants: ProductVariant[] = (product.product_variants || []).map((v: any) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    stock: v.stock,
    image_url: v.image_url, // Novo campo
    cutPrice: v.cut_price || undefined, // Novo campo
    options: {
      // Simulação de extração de opções do nome da variante (ex: "Cor: Vermelho")
      // Em um sistema real, haveria uma tabela de opções separada.
      Variant: v.name, 
    },
  }));

  // Determinar o preço e estoque inicial (usando a primeira variante ou defaults)
  const initialVariant = variants[0];
  const basePrice = initialVariant ? initialVariant.price : 0;
  const baseStock = initialVariant ? initialVariant.stock : 0;
  const baseOriginalPrice = initialVariant ? initialVariant.cutPrice : undefined;

  // Extrair URLs de imagem da nova relação product_images
  const images = (product.product_images || [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((img: any) => img.image_url);
    
  // Se não houver imagens na tabela, usar a imagem principal (image_url) se existir, ou placeholder
  const finalImages = images.length > 0 
    ? images 
    : (product.image_url ? [product.image_url] : ['/placeholder.svg']);

  const storeId = product.stores?.id || 'unknown';

  // Nota: Options (para seleção no frontend) são geradas a partir das variantes
  const options: { name: string; values: string[] }[] = [
    { name: "Variante", values: variants.map(v => v.name) }
  ];

  return {
    id: product.id,
    title: product.name,
    description: product.description || 'Sem descrição.',
    price: basePrice,
    originalPrice: baseOriginalPrice, // Usando o cutPrice da variante principal
    rating: 4.5, // Mocked rating
    reviewCount: 0, // Mocked count
    shop: {
      id: storeId,
      name: product.stores?.name || 'Loja Desconhecida',
      rating: 4.5,
      reviewCount: 0,
      isVerified: product.stores?.active || false,
      memberSince: product.stores?.created_at ? new Date(product.stores.created_at).toLocaleDateString('pt-MZ', { year: 'numeric' }) : 'N/A',
      productCount: 0,
    },
    stock: baseStock,
    category: product.category || 'Outros',
    features: ["Recurso 1", "Recurso 2"], // Mocked
    specifications: { "Detalhe": "Valor" }, // Mocked
    deliveryInfo: { city: 'Maputo', fee: 150, eta: '1-2 dias' }, // Mocked
    reviews: [], // Mocked
    qa: [], // Mocked
    images: finalImages,
    options: options, // Usando as variantes como opções
    variants: variants, // Adicionando todas as variantes
    timeDelivery: '2-5 dias úteis', // Mocked
    isActive: product.is_active ?? true, // Adicionando is_active
  } as Product;
};

// Função de consulta base
const baseProductQuery = () => supabase
  .from('products')
  .select(`
    id, 
    name, 
    description, 
    image_url, 
    category,
    created_at,
    is_active,
    stores (id, name, active, created_at),
    product_variants (id, name, price, stock, image_url, cut_price),
    product_images (image_url, sort_order)
  `);

// Função para sincronizar imagens do storage com a tabela de banners
export const syncBannersWithStorage = async () => {
  const BUCKET_NAME = 'Banners and logos';
  const FOLDER_NAME = 'Banners'; 
  // Usando o nome da tabela com aspas duplas
  const TABLE_NAME = 'banner&Fotos'; 

  try {
    // 1. Listar arquivos no storage
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(FOLDER_NAME, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (listError) throw listError;

    if (!files || files.length === 0) {
      console.log("No files found in storage folder.");
      return;
    }

    // 2. Buscar URLs existentes no banco de dados
    const { data: existingBanners, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select('image_url');

    if (fetchError) throw fetchError;

    const existingUrls: Set<string> = new Set(existingBanners.map(b => b.image_url));
    const newBannersToInsert: any[] = [];

    // 3. Processar arquivos e identificar novos banners
    for (const file of files) {
      if (file.name === '.emptyFolderPlaceholder') continue;

      const filePath = `${FOLDER_NAME}/${file.name}`;
      const publicUrl = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath).data.publicUrl;

      if (!existingUrls.has(publicUrl)) {
        newBannersToInsert.push({
          image_url: publicUrl,
          link: null, 
          title: file.name,
          active: true,
        });
      }
    }

    // 4. Inserir novos banners
    if (newBannersToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert(newBannersToInsert);

      if (insertError) throw insertError;
      console.log(`Successfully inserted ${newBannersToInsert.length} new banners.`);
    }

  } catch (error) {
    console.error("Error during banner synchronization:", error);
  }
};


// Função para buscar banners ativos
export const getBanners = async (): Promise<Banner[]> => {
  const TABLE_NAME = 'banner&Fotos';
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, title, description, image_url, link, active, sort_order')
    .eq('active', true)
    .order('sort_order', { ascending: true, nullsFirst: false }) 
    .order('id', { ascending: true }); 
    
  if (error) {
    console.error("Erro ao buscar banners:", error);
    return [];
  }
  
  // Mapear para o tipo Banner e renomear 'link' para 'link_url'
  return data.map(item => ({
    id: Number(item.id), 
    title: item.title || '',
    description: item.description || '',
    image_url: item.image_url || '/placeholder.svg',
    link_url: item.link || '', 
    active: item.active || false,
  }));
};

// Funções de produto (mantidas)
export const getProductById = async (id: string): Promise<Product> => {
  const { data, error } = await baseProductQuery()
    .eq('id', id)
    .single();
  
  if (error || !data) {
    throw new Error("Produto não encontrado");
  }
  
  return mapSupabaseProductToFrontend(data);
};

export const getSimilarProducts = async (category: string, excludeId?: string | number): Promise<Product[]> => {
  let queryBuilder = baseProductQuery()
    .eq('category', category)
    .limit(4);
    
  // Adicionar filtro para excluir o produto atual
  if (excludeId) {
    queryBuilder = queryBuilder.neq('id', excludeId);
  }
    
  const { data, error } = await queryBuilder;
    
  if (error) {
    console.error("Erro ao buscar produtos similares:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await baseProductQuery();
  
  if (error) {
    console.error("Erro ao buscar todos os produtos:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await baseProductQuery()
    .eq('category', category);
    
  if (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await baseProductQuery()
    .order('created_at', { ascending: false })
    .limit(6);
    
  if (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return [];
  }
  
  return data.map(mapSupabaseProductToFrontend);
};