# PratoFeito — site demonstrativo

## Como abrir
1. Extraia a pasta `pratofeito_site`.
2. Abra o arquivo `index.html` no navegador.
3. Para uma experiência mais próxima de um servidor, abra a pasta no VS Code e use a extensão Live Server.

## Páginas
- `index.html`: início
- `acesso.html`: cadastro e login
- `produtos.html`: catálogo e pesquisa
- `carrinho.html`: carrinho e finalização demonstrativa
- `pedidos.html`: histórico de pedidos
- `perfil.html`: dados do usuário

## Funcionalidades
- Layout responsivo para celular e computador.
- Alternância entre modo claro e escuro, com preferência salva no navegador.
- Máscaras de telefone e CEP.
- Limite de caracteres nos campos.
- Campos de telefone e CEP aceitam apenas números e exibem formatação.
- Pesquisa e filtro de produtos.
- Carrinho com alteração de quantidade, remoção e cálculo de total.
- Cadastro, login e perfil demonstrativos.
- Histórico de pedidos demonstrativo.

## Importante sobre o projeto acadêmico
Este pacote implementa a parte de front-end em HTML, CSS e JavaScript. Os dados ficam no `localStorage` do navegador apenas para demonstração. Isso não é autenticação segura nem substitui banco de dados. Para cumprir a etapa completa de C#, CRUD, banco de dados e hospedagem FTP, será necessário conectar esta interface a uma aplicação back-end em C# e a um banco SQL. Senhas não devem ser armazenadas em texto puro em um sistema real.
