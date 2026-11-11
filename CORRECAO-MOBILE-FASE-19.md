# Fase 19 — Ajustes de corte de imagens e setas no mobile

## O que mudou

- A capa editorial da NÓRRIA usa uma versão vertical feita a partir do próprio arquivo visual original, em navegadores com largura de tela até 800 px.
- As imagens dos quatro cartões de projetos do Studio preservam a proporção original no mobile (`height: auto` / `object-fit: contain`), evitando o corte de textos e marcas.
- Etiquetas sobrepostas nas capas somem somente na versão mobile, onde colidiam com a arte; os links acessíveis continuam abaixo.
- 714 setas textuais `↗` em 122 páginas HTML foram trocadas por SVG inline, que não vira emoji azul do iPhone.
- Versões PT e EN do Studio receberam CSS Fase 19.

## Atualização no GitHub sem recriar o repositório

Extraia o pacote `GABRIEL-BASSO-CORRECAO-MOBILE-FASE-19.zip` e copie **o conteúdo** (incluindo as pastas `assets`, `demo`, `projetos` e `en`) para dentro da cópia local já clonada `Gabriel-publicacao`, confirmando a substituição de arquivos. NÃO mexa em `.git`, que não está no pacote de correção.

Depois, no terminal dentro de `Gabriel-publicacao`:

```powershell
git status --short
git add -A -- ':!.vscode'
git commit -m "Corrige imagens e icones no mobile"
git push origin main
```

Outra opção é usar o pacote `GABRIEL-BASSO-GITHUB-FASE-19.zip` completo. NÃO crie outro repositório Git; basta substituir os arquivos da cópia clonada, mantendo a pasta oculta `.git`.

## Validação

- 210 páginas HTML, 6.416 caminhos locais verificados e zero ausentes.
- 714 SVG no lugar das setas ↗; zero dessas setas restaram como texto.
- 40 verificações dos cartões na homepage em português/inglês em 320, 390, 430, 768 e 1440 px, sem recorte no mobile nem largura horizontal extra.
- Seletor do Guia Rápido verificado em 390 px.
- Nove imagens pessoais originais preservadas, inclusive os dois retratos editoriais.
- Endpoint FormSubmit original inalterado em PT/EN.

Testes em navegador Chromium simulado; não significa que a correção já tenha sido publicada ou validada em aparelho físico iOS/Android.
