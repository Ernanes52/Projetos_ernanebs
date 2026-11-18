# HS Manutenção Náutica — App de Orçamentos, Recibos e Relatórios

Aplicativo React completo, rodando localmente no seu computador, com todas as telas e fluxos descritos: Home, Novo Orçamento (multistep), Novo Recibo, Itens Emitidos (histórico) e Dashboard/Relatórios.

Os dados (clientes e documentos) ficam salvos no navegador (localStorage) — ou seja, continuam lá mesmo se você fechar e abrir de novo, mas só nesse computador/navegador.

---

## PASSO 1 — Instalar o Node.js (só precisa fazer isso uma vez)

O Node.js é o programa que permite "ligar" o projeto no seu PC.

1. Acesse **https://nodejs.org**
2. Baixe a versão **LTS** (a recomendada, em destaque na página)
3. Abra o instalador baixado e clique em "Next" / "Avançar" até finalizar (pode deixar todas as opções no padrão)
4. Reinicie o computador se for solicitado

Para confirmar que funcionou, abra o terminal:
- **Windows:** aperte `Win + R`, digite `cmd` e Enter
- **Mac:** abra o app "Terminal"

E digite:
```
node -v
```
Se aparecer um número de versão (ex: `v20.11.0`), está tudo certo.

---

## PASSO 2 — Extrair o projeto

1. Baixe o arquivo `.zip` que te enviei
2. Clique com botão direito nele → "Extrair tudo" (Windows) ou dê duplo clique (Mac)
3. Escolha uma pasta fácil de achar, por exemplo `Documentos\hs-manutencao`

---

## PASSO 3 — Instalar as dependências do projeto

1. Abra o terminal (cmd ou Terminal)
2. Navegue até a pasta extraída. Exemplo, se você extraiu em Documentos:
   ```
   cd Documentos\hs-manutencao
   ```
   (no Mac seria `cd Documents/hs-manutencao`)
3. Digite o comando abaixo e aperte Enter — isso baixa as "peças" que o app precisa para funcionar (só precisa fazer isso uma vez, ou quando você apagar a pasta `node_modules`):
   ```
   npm install
   ```
   Aguarde terminar (pode levar 1-2 minutos).

---

## PASSO 4 — Rodar o aplicativo

Ainda dentro da mesma pasta, no terminal, digite:
```
npm run dev
```

Vai aparecer algo como:
```
  VITE ready
  ➜  Local:   http://localhost:5173/
```

O navegador deve abrir automaticamente. Se não abrir, copie o endereço `http://localhost:5173/` e cole no navegador.

**Para parar o app:** volte ao terminal e aperte `Ctrl + C`.
**Para rodar de novo depois:** só repita o Passo 4 (`npm run dev`) — não precisa rodar `npm install` de novo, a menos que algo dê erro.

---

## O que já está funcional

- **Home:** menu com os 4 botões (Novo Orçamento, Novo Recibo, Itens Emitidos, Clientes) + navegação inferior (Operacional / Relatórios)
- **Novo Orçamento:** fluxo completo em 5 passos — título → dados do cliente (com busca de CEP real via ViaCEP, e simulação de busca de CNPJ) → serviços/materiais com abas e total dinâmico → condições e observações → revisão e geração de PDF (via impressão do navegador)
- **Novo Recibo:** formulário único com geração automática do texto legal do recibo (valor por extenso em português)
- **Itens Emitidos:** abas (Orçamentos, O.S., Contratos, Recibos), busca, filtro por período, painel de totais, cards com badges de status e menu de contexto (gerar O.S., gerar contrato, aprovar, excluir etc.)
- **Clientes:** cadastro e listagem, com busca de endereço por CEP
- **Relatórios:** seletor de mês, KPIs comparativos, status (andamento/interrompidas/finalizadas), gráficos comparativos, resumos financeiros e geração de relatório consolidado

## Gerar PDF

Como é um projeto web, a geração de PDF usa a função de impressão do navegador (`Imprimir / Salvar PDF` → escolher "Salvar como PDF" na janela de impressão). O layout já vem formatado como documento profissional.

## Próximos passos possíveis

- Tela "Operacional" ainda é só uma estrutura inicial (a descrição original não detalhava o conteúdo dela)
- Conectar a um banco de dados real (hoje os dados ficam só no navegador)
- Publicar online para acessar pelo celular
