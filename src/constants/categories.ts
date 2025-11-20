export interface CategoryItem {
  group: string;
  categories: string[];
  image_url?: string; // Adicionado campo para imagem de preview
}

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  {
    group: "Moda e Estilo",
    categories: [
      "Roupas masculinas",
      "Roupas femininas",
      "Calçados",
      "Acessórios (relógios, joias, bonés, cintos, óculos)",
      "Moda infantil",
      "Moda esportiva",
    ],
    image_url: "https://images.unsplash.com/photo-1558769132-cb1aea458fcd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Tecnologia e Eletrônicos",
    categories: [
      "Smartphones e tablets",
      "Computadores e acessórios",
      "Televisores e áudio",
      "Gaming (consoles, controles, acessórios)",
      "Gadgets e wearables (smartwatch, fones Bluetooth)",
      "Equipamentos de escritório",
    ],
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Casa e Decoração",
    categories: [
      "Móveis",
      "Cozinha e utensílios",
      "Iluminação",
      "Cama, mesa e banho",
      "Decoração",
      "Jardim e exterior",
    ],
    image_url: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Eletrodomésticos",
    categories: [
      "Grandes eletrodomésticos (frigoríficos, fogões, máquinas de lavar)",
      "Pequenos eletrodomésticos (liquidificadores, ferros, chaleiras, torradeiras)",
      "Climatização (ventoinhas, aquecedores, ar condicionado)",
    ],
    image_url: "https://images.unsplash.com/photo-1588854337236-6889d64364c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Beleza e Cuidados Pessoais",
    categories: [
      "Maquiagem",
      "Cabelos",
      "Perfumes",
      "Higiene e cuidados corporais",
      "Produtos masculinos",
    ],
    image_url: "https://images.unsplash.com/photo-1558558254-a301c1291993?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Bebés e Crianças",
    categories: [
      "Roupa e calçado infantil",
      "Brinquedos",
      "Fraldas e higiene",
      "Alimentação e amamentação",
      "Carrinhos e cadeiras",
    ],
    image_url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Ferramentas e Construção",
    categories: [
      "Ferramentas elétricas",
      "Ferramentas manuais",
      "Material de construção",
      "Equipamentos de segurança",
      "Iluminação industrial",
    ],
    image_url: "https://images.unsplash.com/photo-1581578731548-2647c688613a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Automóveis e Motos",
    categories: [
      "Peças e acessórios",
      "Lubrificantes e manutenção",
      "Equipamentos para oficina",
      "Pneus e rodas",
    ],
    image_url: "https://images.unsplash.com/photo-1580414079200-f12555200f39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Papelaria e Escritório",
    categories: [
      "Material escolar",
      "Impressoras e cartuchos",
      "Móveis de escritório",
      "Artigos de papelaria",
    ],
    image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Esportes e Lazer",
    categories: [
      "Roupas e calçados esportivos",
      "Equipamentos de treino",
      "Bicicletas e acessórios",
      "Camping e aventura",
    ],
    image_url: "https://images.unsplash.com/photo-1541252260730-041e2e49b6a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Supermercado e Alimentos",
    categories: [
      "Mercearia",
      "Bebidas",
      "Produtos de limpeza",
      "Higiene doméstica",
    ],
    image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Saúde e Bem-estar",
    categories: [
      "Suplementos alimentares",
      "Produtos médicos",
      "Equipamentos de saúde",
      "Cuidados naturais",
    ],
    image_url: "https://images.unsplash.com/photo-1532632931064-56d04050e2c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Animais de Estimação",
    categories: [
      "Ração e petiscos",
      "Higiene e cuidados",
      "Brinquedos e acessórios",
      "Aquários e gaiolas",
    ],
    image_url: "https://images.unsplash.com/photo-1548199973-03cce0fd8f44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    group: "Entretenimento e Cultura",
    categories: [
      "Livros",
      "Filmes e música",
      "Arte e colecionáveis",
      "Instrumentos musicais",
    ],
    image_url: "https://images.unsplash.com/photo-1521587765099-8835e7201186?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Função para obter todas as categorias planas (para uso em selects e mapeamento)
export const getFlatCategories = () => {
  const flatCategories: { id: number; nome: string }[] = [];
  let id = 1;
  PRODUCT_CATEGORIES.forEach(group => {
    group.categories.forEach(category => {
      flatCategories.push({ id: id++, nome: category });
    });
  });
  return flatCategories;
};

// Função para obter todos os nomes de categoria
export const getAllCategoryNames = () => {
  return PRODUCT_CATEGORIES.flatMap(group => group.categories);
};