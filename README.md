# DLD — Du Locuções Divulgações

Site recuperado do projeto existente em 30/09/2026. Código recuperado: d9b824a5254f9fbb0958f809fcaac1a29c51d515. O projeto indicava versão 30, com atualização em 29/09/2026.

## Conteúdo

- `dist/`: site pronto, com 8 páginas, estilos, JavaScript, fotos, logomarcas e vídeos locais.
- `generate-content.mjs`: gerador original do catálogo de projetos e parceiros.
- `tools/rebuild_media.py`: ferramenta original de preparação de mídias; depende de materiais originais externos na pasta staging. Não é necessária para colocar o site no ar.
- `.github/workflows/pages.yml`: configuração para publicar a pasta dist no GitHub Pages.

O site é estático. Não precisa instalar Node, executar build ou usar senha de acesso do ChatGPT para servir as páginas. Os arquivos já estão prontos. Fontes do Google e links das redes sociais dependem de acesso à internet.

## Colocar no GitHub

1. Extraia este ZIP no computador.
2. No GitHub Desktop, crie um repositório chamado `dld-site`, com branch `main`.
3. Copie todo o conteúdo extraído para a pasta do repositório, incluindo `.github` e `.gitignore`. A pasta `dist` deve ficar diretamente na raiz do repositório.
4. Faça um commit e use Publish repository. Escolha a visibilidade desejada. Para evitar limites do upload pelo navegador, use GitHub Desktop para enviar os arquivos.
5. Para publicar pelo GitHub Pages, abra Settings → Pages e selecione GitHub Actions como fonte. Execute o fluxo Publicar site DLD no GitHub Pages na aba Actions caso o primeiro envio tenha ocorrido antes dessa configuração.
6. O endereço de publicação aparecerá nas configurações de Pages e na execução do fluxo.

Enviar o ZIP inteiro como um único arquivo ao repositório não publica o site: envie os arquivos extraídos.

## Conferir no computador

Na pasta do repositório, execute `python -m http.server 8000 --directory dist` e abra http://localhost:8000. Abrir por duplo clique pode impedir o carregamento do catálogo JSON.

## Verificação da recuperação

Conferidos 8 arquivos HTML e suas referências locais, 24 artes no catálogo de projetos e 96 parceiros. Nenhuma referência local nos HTML estava ausente. O maior arquivo tem aproximadamente 12,9 MB. Esta exportação preserva a aparência e o conteúdo recuperados; não corrige pendências visuais da conversa anterior.

Nenhum site foi publicado ou alterado nesta recuperação. Não foram incluídos credenciais, histórico Git ou arquivos internos da hospedagem.

## Pacote conferido em 30/09/2026

Leia CONFERENCIA.md. Todos os 253 materiais recebidos estão em materiais-originais. Foram acrescentadas três fotos à galeria da cópia. Para o repositório existente, use Site-DLD. Não execute os geradores antigos sem adaptar e conferir suas entradas: eles usam pastas antigas e podem sobrescrever o catálogo. A publicação continua usando apenas dist.
