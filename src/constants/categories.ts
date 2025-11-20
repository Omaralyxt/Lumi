export interface CategoryItem {
  group: string;
  categories: string[];
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
  },
  {
    group: "Eletrodomésticos",
    categories: [
      "Grandes eletrodomésticos (frigoríficos, fogões, máquinas de lavar)",
      "Pequenos eletrodomésticos (liquidificadores, ferros, chaleiras, torradeiras)",
      "Climatização (ventoinhas, aquecedores, ar condicionado)",
    ],
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
  },
  {
    group: "Automóveis e Motos",
    categories: [
      "Peças e acessórios",
      "Lubrificantes e manutenção",
      "Equipamentos para oficina",
      "Pneus e rodas",
    ],
  },
  {
    group: "Papelaria e Escritório",
    categories: [
      "Material escolar",
      "Impressoras e cartuchos",
      "Móveis de escritório",
      "Artigos de papelaria",
    ],
  },
  {
    group: "Esportes e Lazer",
    categories: [
      "Roupas e calçados esportivos",
      "Equipamentos de treino",
      "Bicicletas e acessórios",
      "Camping e aventura",
    ],
  },
  {
    group: "Supermercado e Alimentos",
    categories: [
      "Mercearia",
      "Bebidas",
      "Produtos de limpeza",
      "Higiene doméstica",
    ],
  },
  {
    group: "Saúde e Bem-estar",
    categories: [
      "Suplementos alimentares",
      "Produtos médicos",
      "Equipamentos de saúde",
      "Cuidados naturais",
    ],
  },
  {
    group: "Animais de Estimação",
    categories: [
      "Ração e petiscos",
      "Higiene e cuidados",
      "Brinquedos e acessórios",
      "Aquários e gaiolas",
    ],
  },
  {
    group: "Entretenimento e Cultura",
    categories: [
      "Livros",
      "Filmes e música",
      "Arte e colecionáveis",
      "Instrumentos musicais",
    ],
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