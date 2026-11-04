# CONTENT MAPPING — Mapeamento de Conteúdo do Cliente vs. Site Legado

> **Documento Oficial de Mapeamento:** `docs/CONTENT-MAPPING.md`  
> **Data:** 02 de Novembro de 2026  
> **Fontes de Referência:**
> 1. `docs/references/screenshot.png` (Captura de tela visual do site de referência).
> 2. `docs/references/client-content.pdf` (*Textos do site — Serviços, Sobre nós, Contato, Missão e Valores* por @Wallace, Nov 1, 2026).
> 3. Código legado original (`index.html`, `styles.css`, `main.js`, `assets/`).

---

## 1. Classificação das Ações de Integração

- **SUBSTITUIR:** O conteúdo do cliente substitui diretamente o texto legado em uma seção existente sem quebra estrutural.
- **ADICIONAR:** Conteúdo novo fornecido pelo cliente a ser incorporado harmoniosamente na estrutura existente.
- **PRESERVAR:** Conteúdo, funcionalidade, link ou elemento visual legado que deve ser mantido intacto.
- **REMOVER:** Elemento legado descontinuado ou descartado pelo cliente com justificativa clara.
- **AGUARDAR APROVAÇÃO:** Divergência crítica de negócio (ex: número de WhatsApp, handle do Instagram, placeholders entre colchetes) que exige validação formal do responsável antes da aplicação definitiva.

---

## 2. Matriz Geral de Mapeamento de Conteúdo

| Seção | Conteúdo Atual (Legado) | Conteúdo do Cliente (Relatório Oficial) | Ação Necessária | Status |
|---|---|---|---|---|
| **01. Header / Topbar** | - Social Links: Instagram (`@nexus.ag.contato`), LinkedIn, Facebook.<br>- Telefone WhatsApp: `+55 (61) 99539-5969`.<br>- CTA Nav: "Contato" (`wa.me/5561995395969`). | - Canais indicados: WhatsApp `+55 (61) 9298-5392`, Instagram `@nexusagencybr`.<br>- E-mail novo: `contato@nexusagencybr.com.br`.<br>- Novo CTA sugerido: "Falar no WhatsApp" / "Quero um diagnóstico gratuito". | **SUBSTITUIR** (WhatsApp, Instagram, LinkedIn — `PEND-07`/`PEND-08` RESOLVED)<br>**ADICIONAR** (e-mail, só no rodapé — `PEND-11` RESOLVED, [story 7.4](stories/7-4-email-institucional-rodape.md)) | `APPROVED` (canais e e-mail) |
| **02. Hero / Entrada** (`#home`) | - Subtítulo: "Nexus Agency".<br>- Título: "Somos Nexus Agency.".<br>- Parágrafo: "Em um mundo cada vez mais conectado, uma presença digital consolidada...". | - O relatório não propôs substituição explícita para o texto do Hero (focou em Serviços, Sobre nós, Contato, Missão e Valores).<br>- Captura visual confirma a composição e background `header.webp`. | **PRESERVAR** | `APPROVED`<br>(Manter Hero original) |
| **03. Sobre nós** (`#about`) | - Título: "Sobre nós".<br>- Texto: "A Nexus surge como uma referência inovadora no cenário do marketing digital...".<br>- Destaque: "Contando com um time experiente com passagens por grandes agências...". | - Novo Título: *"Dados que viram decisões. Decisões que viram resultado."*<br>- Novo Texto (5 parágrafos estruturados): Trajetória com +50 empresas, atuação de ponta a ponta, equipe sênior multidisciplinar.<br>- Números de Destaque (Métricas): `+50 clientes atendidos`, `[número] milhões de pessoas alcançadas`, `[número] conversas atendidas`, `[número] anos de mercado`. | **SUBSTITUIR** (textos aprovados)<br>**AGUARDAR APROVAÇÃO** (preenchimento dos colchetes `[número]`) | `APPROVED` (textos)<br>`PENDING_APPROVAL` (métricas numéricas) |
| **04. Banner Diferenciais** | - 3 Cards: "Design", "Desenvolvimento", "Teste & QA". | - O relatório não menciona diretamente estes 3 cards, mas reforça os pilares de "Estratégia, Tecnologia e Dados".<br>- Captura de tela confirma a presença destacada dos 3 cards. | **PRESERVAR** | `APPROVED`<br>(Manter visual e cards) |
| **05. Projetos / Portfólio** (`#project`) | - Título: "Criação e Desenvolvimento".<br>- Filtros: Todos, Fast Food, Tecnologia, Viagens.<br>- 6 Imagens: Wine, Burguer, WooCommerce, Pixologia, Hotel, WDM. | - Relatório registra pendência: *"Autorização de clientes para exibir logos e cases"*, mas não remove a seção.<br>- Captura de tela confirma os 6 cases ativos. | **PRESERVAR** | `APPROVED`<br>(Preservar cases até novas orientações) |
| **06. Nossos Serviços** (`#service`) | - Título: "O que fazemos?".<br>- Subtítulo: "Nossos Serviços".<br>- 6 Cards legados: Criação e Desenvolvimento, Business Intelligence!, Trafego Pago, Inbound Marketing, SEO, Digital Marketing (com textos em inglês e duplicados). | - Novo Título: *"Do anúncio ao atendimento, cuidamos de toda a jornada do seu cliente."*<br>- Novo Subtítulo: *"Não entregamos peças soltas. Montamos um sistema em que cada etapa alimenta a próxima: atrair, converter, atender e medir."*<br>- 6 Novos Serviços estruturados com descrição + 4 bullets cada:<br>  1. *Planejamento estratégico*<br>  2. *Gestão de tráfego pago*<br>  3. *Análise e posicionamento nas redes sociais*<br>  4. *Criação de sites e landing pages*<br>  5. *Chatbots e automação de atendimento*<br>  6. *Relatórios e análise de resultados* | **SUBSTITUIR** | `APPROVED`<br>(Resolve inconsistências de inglês e repetições) |
| **07. Pacotes Comerciais** (Novo Bloco em Serviços) | - *Inexistente no site legado.* | - Tabela/Cards com 3 pacotes e públicos-alvo:<br>  - *Essencial:* Tráfego pago + relatório mensal (Para quem já tem site e atendimento estruturados).<br>  - *Crescimento:* Essencial + landing page (Para quem precisa de uma página que converta).<br>  - *Completo:* Crescimento + chatbot e automações (Para quem quer o funil inteiro funcionando).<br>- CTA: *"Quero um diagnóstico gratuito"*. | **ADICIONAR** (extensão natural da seção de serviços sem criar rota nova) | `APPROVED`<br>(Integrar como grid de cards na seção de serviços) |
| **08. Missão, Visão e Valores** (Novo Bloco Institucional) | - *Inexistente como seção isolada no site legado.* | - *Missão:* Transformar investimento em comunicação digital em resultados reais...<br>- *Visão:* Ser reconhecida como a agência que une estratégia, tecnologia e dados...<br>- *6 Valores:* Resultado acima de aparência; Transparência; Parceria; Inovação com propósito; Melhoria contínua; Compromisso. | **ADICIONAR** (integrar como subdivisão na seção Sobre nós ou bloco complementar) | `APPROVED`<br>(Adicionar em harmonia com o layout escuro) |
| **09. Blog** (`#blog`) | - Subtítulo: "Postagens de blog".<br>- Título: "Atualidades sobre tecnologia".<br>- 3 Artigos com links `#`. | - O relatório do cliente não altera o blog nem fornece novos artigos.<br>- A captura de tela confirma a presença da seção Blog. | **PRESERVAR** | `APPROVED`<br>(Manter os 3 artigos existentes com links `#`)<br>**Removido** em 2026-11-03 por decisão do responsável (`PEND-02`, [story 7.3](stories/7-3-links-rodape-remover-blog.md)) |
| **10. Contato & Formulário** (`#contact`) | - Título: "Entre em contato".<br>- Subtítulo: "Fale conosco".<br>- Form legado com 5 campos: Nome, Sobrenome, Email, Descrição, Rádios (Marketing, Sites, Tráfego Pago, BI, Outros).<br>- Botão: "Enviar". | - Novo Título: *"Vamos conversar sobre o seu crescimento?"*<br>- Novo Texto: *"Conte um pouco sobre o seu negócio. Em até [24 horas úteis], nossa equipe responde com um diagnóstico inicial e os próximos passos, sem compromisso."*<br>- Novo Formulário (4 campos objetivos):<br>  1. *Nome*<br>  2. *WhatsApp*<br>  3. *Empresa ou projeto*<br>  4. *O que você precisa?* (Select/Rádios: Tráfego pago, Site ou landing page, Chatbot e automação, Pacote completo).<br>- Novo Botão: *"Quero meu diagnóstico gratuito"*.<br>- Mensagem pós-envio: *"Recebemos seu contato! Em breve alguém da nossa equipe vai falar com você pelo WhatsApp."* | **SUBSTITUIR** (textos e campos)<br>**AGUARDAR APROVAÇÃO** (prazo `[24 horas úteis]`) | `APPROVED` (estrutura e campos)<br>`PENDING_APPROVAL` (prazo entre colchetes) |
| **11. Rodapé (Footer)** | - Logo, texto de compromisso, links `#` de serviços/suporte, redes sociais legadas. | - Integração dos novos canais:<br>  - E-mail: `contato@nexusagencybr.com.br`<br>  - WhatsApp: `+55 (61) 9298-5392`<br>  - Horário: `[segunda a sexta, das 9h às 18h]`<br>  - Endereço: `[Atendimento em todo o Brasil, 100% online]`.<br>- Links de serviços atualizados para refletir o novo escopo. | **SUBSTITUIR** (links e e-mail)<br>**AGUARDAR APROVAÇÃO** (endereço e horário em colchetes) | `APPROVED` (estrutura)<br>`PENDING_APPROVAL` (placeholders de colchetes) |
| **12. Botão Flutuante WhatsApp** | - Pílula verde no canto inferior direito (`fa fa-whatsapp`, "Quero saber mais!"). | - Captura visual confirma o botão exatamente na posição atual.<br>- Relatório reforça o WhatsApp como canal primário de conversão. | **PRESERVAR** | `APPROVED`<br>(Manter visual; aguardar validação do número) |

---

## 3. Análise Detalhada das Divergências Críticas e Decisões Pendentes

> O status de cada divergência mora na tabela PEND-xx do [TASKS.md](TASKS.md#pendências-de-decisão-registradas-para-alinhamento-com-responsável); esta seção guarda só o detalhe de conteúdo.

### Divergência 1: Número de WhatsApp Oficial (`PEND-07` — RESOLVED 2026-11-02: vale o do cliente)
- **Site Legado:** `+55 (61) 99539-5969` (presente em todos os botões ativos de `index.html`).
- **Relatório do Cliente:** `+55 (61) 9298-5392` (página 4 do PDF).
- **Ação:** `AGUARDAR APROVAÇÃO`. Ambos são DDD 61 (Distrito Federal). É necessário que o responsável confirme se o número novo substitui o anterior em todos os botões ou se ambos coexistem.

### Divergência 2: Perfil do Instagram (`PEND-08` — RESOLVED 2026-11-02: vale o do cliente, assim como o LinkedIn `company/nexus-ag-br`)
- **Site Legado:** `https://www.instagram.com/nexus.ag.contato`
- **Relatório do Cliente:** `@nexusagencybr` (`https://www.instagram.com/nexusagencybr`)
- **Ação:** `AGUARDAR APROVAÇÃO`. Confirmar a migração para a nova conta oficial `@nexusagencybr`.

### Divergência 3: Informações entre Colchetes que o Cliente Não Preencheu (`PEND-09`)
O próprio cliente sinalizou na página 5 que faltam dados. São eles:
- `[ano]` de fundação da agência.
- `[número]` milhões de pessoas alcançadas em campanhas.
- `[número]` conversas atendidas pelos chatbots.
- `[número]` anos de mercado.
- `[24 horas úteis]` prazo de retorno do diagnóstico.
- `[endereço ou "Atendimento em todo o Brasil, 100% online"]`.
- `[segunda a sexta, das 9h às 18h]` horário de atendimento.
- **Ação:** `AGUARDAR APROVAÇÃO`. Onde houver texto de fallback fornecido pelo cliente (como `"Atendimento em todo o Brasil, 100% online"`), utilizaremos o fallback; onde houver `[número]`, manteremos oculto ou com placeholder seguro até aprovação.

### Divergência 4: Incorporação de "Pacotes" e "Missão, Visão e Valores" sem Redesign
- **Regra Inegociável:** Não criar novas páginas/rotas nem quebrar a identidade visual escura (`#04091d` / `#0f1221`) comprovada pela captura de tela.
- **Solução Arquitetural Aprovada:**
  - **Pacotes:** Serão inseridos como um submenu/grid complementar logo abaixo dos 6 cards da seção **Serviços**, aproveitando a mesma linguagem visual de cards com borda roxa.
  - **Missão, Visão e Valores:** Serão incorporados harmonicamente dentro da seção **Sobre nós**, como blocos tabulados ou cards secundários subsequentes aos números de destaque, mantendo o fluxo narrativo unificado.

---

## 4. Próximos Passos na Reconstrução da Fase 2

1. Atualizar o arquivo central de dados [`src/data/services.ts`](../src/data/services.ts) com os 6 novos serviços e bullets do cliente.
2. Criar [`src/data/packages.ts`](../src/data/packages.ts) para comportar os 3 pacotes comerciais (Essencial, Crescimento, Completo).
3. Atualizar [`src/data/about.ts`](../src/data/about.ts) com o novo texto de 5 parágrafos e a estrutura de Missão, Visão e Valores.
4. Ajustar os campos e mensagens do formulário em [`src/sections/Contact/index.tsx`](../src/sections/Contact/index.tsx) para os 4 campos solicitados.
5. Reconstruir a fidelidade visual da seção **Hero** aplicando o background `header.webp` conforme evidenciado na captura de tela.
