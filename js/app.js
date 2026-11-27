// PratoFeito - funcionalidades do site
// Este projeto usa localStorage apenas para demonstracao no navegador.
// Em uma versao real, cadastro, login e pedidos devem ser tratados pelo servidor C#.

const CHAVES = {
  usuarios: "pratofeito_usuarios",
  usuarioAtual: "pratofeito_usuario_atual",
  carrinho: "pratofeito_carrinho",
  pedidos: "pratofeito_pedidos",
  tema: "pratofeito_tema"
};

const produtos = [
  { id: 1, nome: "Cesta Essencial", categoria: "essencial", descricao: "Arroz, feijão, macarrão, óleo, açúcar e itens básicos.", preco: 89.90, emoji: "🧺" },
  { id: 2, nome: "Cesta Família", categoria: "familia", descricao: "Uma seleção maior de alimentos para a rotina da família.", preco: 149.90, emoji: "🛒" },
  { id: 3, nome: "Cesta Econômica", categoria: "economica", descricao: "Produtos essenciais com preço mais acessível.", preco: 69.90, emoji: "🥫" },
  { id: 4, nome: "Cesta Completa", categoria: "familia", descricao: "Alimentos variados para abastecer a despensa.", preco: 189.90, emoji: "🍚" },
  { id: 5, nome: "Cesta Pequena", categoria: "essencial", descricao: "Uma opção compacta para necessidades menores.", preco: 54.90, emoji: "🥫" },
  { id: 6, nome: "Cesta do Mês", categoria: "economica", descricao: "Itens de consumo frequente para o mês.", preco: 119.90, emoji: "📦" }
];

function lerDados(chave, padrao) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : padrao;
  } catch (erro) {
    return padrao;
  }
}

function salvarDados(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function dinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function usuarioAtual() {
  return lerDados(CHAVES.usuarioAtual, null);
}

function montarEstrutura() {
  const pagina = document.body.dataset.page;
  const links = [
    ["inicio", "Início", "index.html"],
    ["produtos", "Cestas básicas", "produtos.html"],
    ["pedidos", "Meus pedidos", "pedidos.html"],
    ["carrinho", "Carrinho", "carrinho.html"],
    ["perfil", "Meu perfil", "perfil.html"]
  ];

  const linksHtml = links.map(([id, nome, url]) =>
    `<a class="${pagina === id ? "ativo" : ""}" href="${url}">${nome}${id === "carrinho" ? ` (${quantidadeCarrinho()})` : ""}</a>`
  ).join("");

  document.getElementById("cabecalho").innerHTML = `
    <header class="cabecalho">
      <div class="container navegacao">
        <a class="marca" href="index.html"><span class="marca-icone">🥗</span><span>PratoFeito</span></a>
        <button class="botao-menu" id="botao-menu" type="button" aria-label="Abrir menu">☰</button>
        <nav class="links-navegacao" id="links-navegacao">${linksHtml}</nav>
        <div class="acoes-navegacao">
          <button class="botao-tema" id="botao-tema" type="button" aria-label="Alternar tema">◐</button>
          ${usuarioAtual()
            ? `<a class="botao botao-secundario" href="#" id="botao-sair">Sair</a>`
            : `<a class="botao botao-secundario" href="acesso.html">Entrar</a>`}
        </div>
      </div>
    </header>`;

  document.getElementById("rodape").innerHTML = `
    <footer class="rodape">
      <div class="container rodape-conteudo">
        <div><strong>🥗 PratoFeito</strong><p>Alimentação acessível, entrega que aproxima.</p><p>Projeto acadêmico – Belo Horizonte, MG.</p></div>
        <div class="rodape-links"><a href="index.html">Início</a><a href="produtos.html">Cestas básicas</a><a href="acesso.html">Cadastro</a></div>
      </div>
    </footer>`;

  document.getElementById("botao-tema").addEventListener("click", alternarTema);
  document.getElementById("botao-menu").addEventListener("click", () => {
    document.getElementById("links-navegacao").classList.toggle("aberto");
  });
  const botaoSair = document.getElementById("botao-sair");
  if (botaoSair) {
    botaoSair.addEventListener("click", (evento) => {
      evento.preventDefault();
      localStorage.removeItem(CHAVES.usuarioAtual);
      window.location.href = "index.html";
    });
  }
  aplicarTemaSalvo();
}

function aplicarTemaSalvo() {
  const tema = localStorage.getItem(CHAVES.tema) || "claro";
  document.body.classList.toggle("tema-escuro", tema === "escuro");
}

function alternarTema() {
  const escuro = document.body.classList.toggle("tema-escuro");
  localStorage.setItem(CHAVES.tema, escuro ? "escuro" : "claro");
}

function quantidadeCarrinho() {
  return lerDados(CHAVES.carrinho, []).reduce((total, item) => total + item.quantidade, 0);
}

function criarCartaoProduto(produto) {
  return `
    <article class="cartao-produto">
      <div class="produto-ilustracao" aria-hidden="true">${produto.emoji}</div>
      <div class="produto-conteudo">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="produto-rodape">
          <span class="preco">${dinheiro(produto.preco)}</span>
          <button class="botao" type="button" data-adicionar="${produto.id}">Adicionar</button>
        </div>
      </div>
    </article>`;
}

function mostrarProdutos(lista, elemento) {
  elemento.innerHTML = lista.map(criarCartaoProduto).join("");
  elemento.querySelectorAll("[data-adicionar]").forEach(botao => {
    botao.addEventListener("click", () => adicionarAoCarrinho(Number(botao.dataset.adicionar)));
  });
}

function adicionarAoCarrinho(id) {
  const carrinho = lerDados(CHAVES.carrinho, []);
  const item = carrinho.find(produto => produto.id === id);
  if (item) item.quantidade += 1;
  else carrinho.push({ id, quantidade: 1 });
  salvarDados(CHAVES.carrinho, carrinho);
  alert("Cesta adicionada ao carrinho!");
  if (document.body.dataset.page === "carrinho") renderizarCarrinho();
}

function configurarInicio() {
  const area = document.getElementById("destaques-produtos");
  if (area) mostrarProdutos(produtos.slice(0, 3), area);
}

function configurarProdutos() {
  const campoPesquisa = document.getElementById("pesquisa-produtos");
  const filtro = document.getElementById("filtro-categoria");
  const area = document.getElementById("lista-produtos");
  const vazio = document.getElementById("nenhum-produto");

  function filtrar() {
    const termo = campoPesquisa.value.trim().toLocaleLowerCase("pt-BR");
    const categoria = filtro.value;
    const encontrados = produtos.filter(produto =>
      produto.nome.toLocaleLowerCase("pt-BR").includes(termo) &&
      (categoria === "todas" || produto.categoria === categoria)
    );
    mostrarProdutos(encontrados, area);
    vazio.classList.toggle("oculto", encontrados.length > 0);
  }
  campoPesquisa.addEventListener("input", filtrar);
  filtro.addEventListener("change", filtrar);
  filtrar();
}

function renderizarCarrinho() {
  const area = document.getElementById("conteudo-carrinho");
  if (!area) return;
  const carrinho = lerDados(CHAVES.carrinho, []);
  if (carrinho.length === 0) {
    area.innerHTML = `<div class="estado-vazio"><h2>Seu carrinho está vazio</h2><p>Adicione uma cesta para começar sua compra.</p><a class="botao" href="produtos.html">Ver cestas básicas</a></div>`;
    return;
  }

  const itens = carrinho.map(item => {
    const produto = produtos.find(p => p.id === item.id);
    if (!produto) return "";
    return `<article class="linha-carrinho">
      <div class="item-carrinho"><div class="icone-carrinho">${produto.emoji}</div><div><h3>${produto.nome}</h3><p>${dinheiro(produto.preco)} por unidade</p></div></div>
      <div class="controles-quantidade">
        <button type="button" aria-label="Diminuir quantidade" data-diminuir="${produto.id}">−</button>
        <strong>${item.quantidade}</strong>
        <button type="button" aria-label="Aumentar quantidade" data-aumentar="${produto.id}">+</button>
        <button type="button" class="botao-remover" data-remover="${produto.id}">Remover</button>
      </div>
      <strong>${dinheiro(produto.preco * item.quantidade)}</strong>
    </article>`;
  }).join("");

  const subtotal = carrinho.reduce((total, item) => {
    const produto = produtos.find(p => p.id === item.id);
    return total + (produto ? produto.preco * item.quantidade : 0);
  }, 0);
  const entrega = subtotal > 0 ? 8 : 0;

  area.innerHTML = `${itens}
    <section class="resumo-carrinho">
      <h2>Resumo do pedido</h2>
      <div class="resumo-linha"><span>Subtotal</span><strong>${dinheiro(subtotal)}</strong></div>
      <div class="resumo-linha"><span>Taxa de entrega (simulada)</span><strong>${dinheiro(entrega)}</strong></div>
      <div class="resumo-linha resumo-total"><span>Total</span><strong>${dinheiro(subtotal + entrega)}</strong></div>
      <button class="botao largura-total" id="finalizar-pedido" type="button">Finalizar pedido</button>
      <p class="mensagem-formulario" id="mensagem-finalizacao"></p>
    </section>`;

  area.querySelectorAll("[data-aumentar]").forEach(b => b.addEventListener("click", () => alterarQuantidade(Number(b.dataset.aumentar), 1)));
  area.querySelectorAll("[data-diminuir]").forEach(b => b.addEventListener("click", () => alterarQuantidade(Number(b.dataset.diminuir), -1)));
  area.querySelectorAll("[data-remover]").forEach(b => b.addEventListener("click", () => removerDoCarrinho(Number(b.dataset.remover))));
  document.getElementById("finalizar-pedido").addEventListener("click", finalizarPedido);
}

function alterarQuantidade(id, variacao) {
  const carrinho = lerDados(CHAVES.carrinho, []);
  const item = carrinho.find(p => p.id === id);
  if (item) item.quantidade += variacao;
  salvarDados(CHAVES.carrinho, carrinho.filter(p => p.quantidade > 0));
  renderizarCarrinho();
}

function removerDoCarrinho(id) {
  const carrinho = lerDados(CHAVES.carrinho, []).filter(item => item.id !== id);
  salvarDados(CHAVES.carrinho, carrinho);
  renderizarCarrinho();
}

function finalizarPedido() {
  const usuario = usuarioAtual();
  const mensagem = document.getElementById("mensagem-finalizacao");
  if (!usuario) {
    mensagem.textContent = "Para finalizar, entre ou crie sua conta.";
    return;
  }
  const carrinho = lerDados(CHAVES.carrinho, []);
  if (carrinho.length === 0) return;
  const subtotal = carrinho.reduce((total, item) => {
    const produto = produtos.find(p => p.id === item.id);
    return total + (produto ? produto.preco * item.quantidade : 0);
  }, 0);
  const pedido = {
    numero: Date.now().toString().slice(-7),
    data: new Date().toLocaleDateString("pt-BR"),
    itens: carrinho,
    total: subtotal + 8,
    status: "Pedido recebido",
    email: usuario.email
  };
  const pedidos = lerDados(CHAVES.pedidos, []);
  pedidos.unshift(pedido);
  salvarDados(CHAVES.pedidos, pedidos);
  salvarDados(CHAVES.carrinho, []);
  window.location.href = "pedidos.html";
}

function configurarPedidos() {
  const area = document.getElementById("lista-pedidos");
  const usuario = usuarioAtual();
  if (!usuario) {
    area.innerHTML = `<div class="estado-vazio"><h2>Entre na sua conta</h2><p>Faça login para consultar seus pedidos.</p><a class="botao" href="acesso.html">Entrar</a></div>`;
    return;
  }
  const pedidos = lerDados(CHAVES.pedidos, []).filter(p => p.email === usuario.email);
  if (pedidos.length === 0) {
    area.innerHTML = `<div class="estado-vazio"><h2>Você ainda não fez pedidos</h2><p>Quando finalizar uma compra, ela aparecerá aqui.</p><a class="botao" href="produtos.html">Ver cestas básicas</a></div>`;
    return;
  }
  area.innerHTML = pedidos.map(pedido => {
    const nomes = pedido.itens.map(item => {
      const produto = produtos.find(p => p.id === item.id);
      return produto ? `${item.quantidade}x ${produto.nome}` : "";
    }).filter(Boolean).join(", ");
    return `<article class="cartao-pedido"><div><h3>Pedido #${pedido.numero}</h3><p>${pedido.data} · ${nomes}</p><span class="status">${pedido.status}</span></div><strong>${dinheiro(pedido.total)}</strong></article>`;
  }).join("");
}

function configurarAcesso() {
  const cadastro = document.getElementById("form-cadastro");
  const login = document.getElementById("form-login");

  cadastro.addEventListener("submit", evento => {
    evento.preventDefault();
    const formulario = new FormData(cadastro);
    const novoUsuario = Object.fromEntries(formulario.entries());
    const usuarios = lerDados(CHAVES.usuarios, []);
    const mensagem = document.getElementById("mensagem-cadastro");

    if (usuarios.some(usuario => usuario.email.toLowerCase() === novoUsuario.email.toLowerCase())) {
      mensagem.textContent = "Este e-mail já está cadastrado.";
      return;
    }
    usuarios.push(novoUsuario);
    salvarDados(CHAVES.usuarios, usuarios);
    salvarDados(CHAVES.usuarioAtual, novoUsuario);
    mensagem.textContent = "Cadastro realizado! Sua conta está pronta.";
    cadastro.reset();
    setTimeout(() => window.location.href = "perfil.html", 700);
  });

  login.addEventListener("submit", evento => {
    evento.preventDefault();
    const formulario = new FormData(login);
    const email = formulario.get("email").trim().toLowerCase();
    const senha = formulario.get("senha");
    const usuarios = lerDados(CHAVES.usuarios, []);
    const usuario = usuarios.find(item => item.email.toLowerCase() === email && item.senha === senha);
    const mensagem = document.getElementById("mensagem-login");

    if (!usuario) {
      mensagem.textContent = "E-mail ou senha não conferem. Verifique os dados.";
      return;
    }
    salvarDados(CHAVES.usuarioAtual, usuario);
    mensagem.textContent = "Login realizado com sucesso!";
    setTimeout(() => window.location.href = "perfil.html", 500);
  });
}

function configurarPerfil() {
  const formulario = document.getElementById("form-perfil");
  const usuario = usuarioAtual();
  const mensagem = document.getElementById("mensagem-perfil");
  if (!usuario) {
    formulario.innerHTML = `<p>Entre na sua conta para visualizar seus dados.</p><a class="botao" href="acesso.html">Entrar</a>`;
    return;
  }

  Object.keys(usuario).forEach(chave => {
    const campo = formulario.elements.namedItem(chave);
    if (campo) campo.value = usuario[chave];
  });

  formulario.addEventListener("submit", evento => {
    evento.preventDefault();
    const dadosAtualizados = { ...usuario, ...Object.fromEntries(new FormData(formulario).entries()) };
    const usuarios = lerDados(CHAVES.usuarios, []);
    const indice = usuarios.findIndex(item => item.email === usuario.email);
    if (indice >= 0) usuarios[indice] = dadosAtualizados;
    salvarDados(CHAVES.usuarios, usuarios);
    salvarDados(CHAVES.usuarioAtual, dadosAtualizados);
    mensagem.textContent = "Seus dados foram atualizados.";
  });
}

// Aplica máscaras e impede letras em campos que devem conter somente números.
function configurarCamposNumericos() {
  document.querySelectorAll("[data-mascara]").forEach(campo => {
    campo.addEventListener("input", () => {
      let numeros = campo.value.replace(/\D/g, "");
      if (campo.dataset.mascara === "telefone") {
        numeros = numeros.slice(0, 11);
        if (numeros.length > 10) {
          campo.value = numeros.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (numeros.length > 6) {
          campo.value = numeros.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (numeros.length > 2) {
          campo.value = numeros.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
        } else {
          campo.value = numeros;
        }
      } else if (campo.dataset.mascara === "cep") {
        numeros = numeros.slice(0, 8);
        campo.value = numeros.length > 5 ? numeros.replace(/^(\d{5})(\d{0,3})$/, "$1-$2") : numeros;
      }
    });
  });

  document.querySelectorAll('input[inputmode="numeric"]').forEach(campo => {
    campo.addEventListener("beforeinput", evento => {
      if (evento.data && /\D/.test(evento.data) && evento.inputType === "insertText") {
        evento.preventDefault();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  montarEstrutura();
  configurarCamposNumericos();

  const pagina = document.body.dataset.page;
  if (pagina === "inicio") configurarInicio();
  if (pagina === "produtos") configurarProdutos();
  if (pagina === "carrinho") renderizarCarrinho();
  if (pagina === "pedidos") configurarPedidos();
  if (pagina === "acesso") configurarAcesso();
  if (pagina === "perfil") configurarPerfil();
});
