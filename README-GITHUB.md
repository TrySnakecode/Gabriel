# Gabriel Basso Studio — código completo para GitHub Pages

Esta pasta é o website estático do **Gabriel Basso Studio**, com os quatro projetos ESTARÉLIA, AURÍNA, ORÍVIA e NÓRRIA, páginas em português e inglês e estudos de caso. A revisão **Fase 18** padroniza ícones que poderiam ser exibidos como emojis coloridos em celulares.

## O que enviar ao GitHub

Use o arquivo **`GABRIEL-BASSO-GITHUB-FASE-18.zip`** (o ZIP de publicação). **Descompacte-o** e envie os arquivos e diretórios extraídos, não o ZIP como um único arquivo.

A raiz do repositório deve conter:

```text
index.html
.nojekyll
robots.txt
favicon.svg
assets/
demo/
en/
projetos/
README-GITHUB.md
```

Não coloque todos esses arquivos dentro de uma pasta extra chamada `GABRIEL-BASSO-GITHUB-FASE-18`, pois a homepage precisa estar na raiz publicada.

## Publicação no GitHub Pages

1. Crie um repositório no GitHub, ou use o repositório existente do portfólio, preservando um commit ou cópia anterior.
2. Extraia o ZIP de publicação para a pasta local do repositório. Confirme que `index.html` está na raiz.
3. Faça commit e push dos arquivos. Uma opção pelo terminal, dentro da pasta extraída e para **um repositório novo e vazio**, é:

```bash
git init
git branch -M main
git add .
git commit -m "Publica Gabriel Basso Studio - Fase 18"
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

4. No GitHub, abra **Settings → Pages → Build and deployment → Deploy from a branch**; selecione `main` e a pasta `/(root)`.
5. Abra a URL publicada e confira as duas homepages, os quatro projetos, os estudos de caso, o formulário e os fluxos demonstrativos.

Para repositórios **já existentes**, prefira clonar o repositório, copiar os arquivos atualizados, conferir o diff e então criar um commit. Não use comandos destrutivos nem force-push.

## Ajuste dos ícones mobile (Fase 18)

- Asteriscos e separadores do Studio e da AURÍNA convertidos para SVG em vez de caracteres decorativos de aparência variável.
- Ícones de coração da NÓRRIA e ESTARÉLIA agora são SVG; o preenchimento depende de `aria-pressed`, mantendo o estado de favoritos.
- Menu, filtro, comparação e botão de fechar imagem da ESTARÉLIA agora usam vetores monocromáticos.
- Páginas individuais de produto da NÓRRIA corrigidas (PT/EN); também foi reforçado o limite de largura da galeria mobile.
- `FormSubmit` e arquivos das fotografias pessoais permanecem inalterados.

Os arquivos relevantes estão em `assets/css/studio-phase16.css`, `assets/{estarelia,norria,aurina}/*.css` e scripts correspondentes.

## Verificação e limites

- Auditoria de 210 HTMLs, referências locais e sintaxe de 24 JavaScripts concluída.
- Testes em Chromium com CSS e JavaScript incorporados, pois a navegação direta ao servidor local está bloqueada no ambiente de execução. Homepage do Studio, NÓRRIA e AURÍNA testadas em larguras mobile representativas; a interação de favoritos na NÓRRIA passou.
- A renderização dinâmica completa da ESTARÉLIA e testes em aparelhos reais ainda exigem validação no site publicado.
- Não houve teste real de entrega de e-mail pelo FormSubmit; não altere o endpoint sem necessidade.
- As empresas e os produtos imobiliários, médicos e comerciais são demonstrações fictícias.

**O arquivo `GABRIEL-BASSO-CODIGO-COMPLETO-FASE-18.zip`** contém também relatórios, capturas anteriores e JSONs de QA para manutenção e auditoria. O ZIP de publicação é o mais indicado para upload.
