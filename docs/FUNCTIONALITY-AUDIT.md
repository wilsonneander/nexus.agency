# RELATÓRIO DE AUDITORIA DE FUNCIONALIDADES E CONVERSÃO COMERCIAL (FASE 4)
## Nexus Agency — Arquitetura de Conversão, Canais e Segurança

**Data da Auditoria:** 02 de Novembro de 2026  
**Status da Fase:** Auditoria e Especificação Concluídas (Aguardando Decisões de Negócio)

---

## 1. Inventário e Auditoria de Contatos

| Canal | Estado Atual | Problema / Divergência Identificada | Solução Recomendada | Dependência de Aprovação | Status |
|---|---|---|---|---|---|
| **WhatsApp Principal** | `+55 (61) 99539-5969` configurado em `SITE_CONFIG.whatsapp.url` (`https://wa.me/5561995395969`) | O relatório do cliente cita `+55 (61) 9298-5392` como canal oficial. | Manter centralizado em `src/lib/constants.ts` e alternar com um único ajuste assim que homologado pelo cliente. | **PEND-07** | `PENDING_APPROVAL` |
| **WhatsApp Flutuante** | Botão `.whatsapp-link` flutuante no canto inferior direito com mensagem `"Quero saber mais!"` | URL herda de `SITE_CONFIG`. Efeito hover/click em GSAP preservando `@keyframes WaveWhatsApp`. | Preservado fielmente. | **PEND-07** | `ACTIVE_READY` |
| **WhatsApp Nav / Mobile** | Botão "Contato" no Navbar desktop e mobile gaveta | Aponta para `wa.me/5561995395969`. Abre em nova aba com `target="_blank" rel="noopener noreferrer"`. | Preservado fielmente. | **PEND-07** | `ACTIVE_READY` |
| **Instagram** | `https://www.instagram.com/nexus.ag.contato?...` nos ícones sociais do Header, About e Footer | O relatório do cliente indica `@nexusagencybr`. Além disso, a URL legada possui aspas extras no parâmetro de URL (`igsh=...==""`). | Atualizar para `https://www.instagram.com/nexusagencybr/` assim que aprovado. | **PEND-08** | `PENDING_APPROVAL` |
| **LinkedIn** | `https://www.linkedin.com/in/nexusagency/` | URL estática legada ativa. | Preservado fielmente. | Nenhuma | `ACTIVE_READY` |
| **Facebook** | `https://www.facebook.com/profile.php?id=...` | URL legada ativa com ID da página. | Preservado fielmente. | Nenhuma | `ACTIVE_READY` |
| **E-mail Institucional** | Ausente na interface visual pública atual. | Relatório do cliente propõe `contato@nexusagencybr.com.br` para suporte e formulário. | Inserir no Footer e cabeçalho de contato assim que o domínio for oficializado. | **PEND-11** | `PENDING_APPROVAL` |

---

## 2. Auditoria do Formulário de Contato (`#contact`)

### 2.1 Estado Atual
- **Campos Implementados:**
  1. `Nome` (`input[type="text"]`, required)
  2. `WhatsApp` (`input[type="tel"]`, required)
  3. `Empresa ou projeto` (`input[type="text"]`, required)
  4. `O que você precisa?` (4 opções via radio buttons: Tráfego pago, Site ou landing page, Chatbot e automação, Pacote completo)
- **Botão CTA:** `"Quero meu diagnóstico gratuito"` (`button[type="submit"]`)
- **Comportamento Atual:** Previne envio padrão (`onSubmit: e.preventDefault()`) e possui `action="/"`. Nenhum dado é gravado ou despachado.

### 2.2 Comparação Técnica das Opções de Integração (Decisão PEND-10)

| Critério | Opção A: Route Handler / Server Action + Email (Resend) | Opção B: Redirecionamento Direto para WhatsApp | Opção C: Plataforma Externa (HubSpot / RD Station / Formspree) |
|---|---|---|---|
| **Complexidade** | **Média**: Criação de `api/contact/route.ts` ou Server Action React 19, schema Zod e template HTML React-Email. | **Mínima**: Apenas formatação de URL `encodeURIComponent` e abertura de janela `window.open(waUrl)`. | **Baixa a Média**: Inclusão de script SDK ou webhook via fetch para endpoint do serviço. |
| **Custos** | **Gratuito / Muito Baixo**: Resend oferece 3.000 emails/mês grátis (tier gratuito cobre perfeitamente a agência). | **Zero**: Sem custo de infraestrutura ou serviços de terceiros. | **Variável**: Gratuito básico (Formspree limitado) ou mensalidades elevadas (RD Station / CRM). |
| **Segurança & Anti-Spam** | **Alta**: Validação server-side, Rate Limiting (Upstash/Redis ou IP tracker) e proteção contra bots (Honeypot + Cloudflare Turnstile). | **Média**: Validação ocorre no cliente; o spammer pode gerar cliques, mas o contato final cai no WhatsApp. | **Alta**: A plataforma de CRM lida com filtros e sanitização de spam. |
| **Experiência do Usuário (UX)** | **Profissional**: Usuário preenche na página, vê feedback de sucesso imediato na tela ("Mensagem enviada com sucesso! Em até 24h entraremos em contato"). | **Imediata**: Redireciona o usuário direto para o app do WhatsApp com o texto já pronto para envio. | **Padrão**: Modal ou mensagem nativa da ferramenta. |
| **Armazenamento de Leads** | Permite registrar em banco de dados interno (Postgres / Supabase) ou enviar cópia oculta para a equipe. | Não há retenção se o usuário desistir antes de clicar em "Enviar" no aplicativo do WhatsApp. | Mantém histórico consolidado e pipelines dentro do CRM. |
| **Recomendação Técnica** | **Recomendada para posicionamento institucional de alta autoridade** (pode coexistir com CTA secundário de WhatsApp). | **Recomendada se o time comercial atende 100% via chat em tempo real**. | Recomendada caso o cliente já possua licença ativa de CRM (RD, HubSpot). |

---

## 3. Auditoria Geral de Links e Navegação

| Local | Elemento / Texto | Destino (`href`) | Diagnóstico | Ação Recomendada |
|---|---|---|---|---|
| **Navbar** | Logo | `#home` | Âncora válida | Preservar |
| **Navbar** | Inicio, Sobre nós, Projetos, Serviços, Blog | `#home`, `#about`, `#project`, `#service`, `#blog` | Âncoras válidas na página | Preservar |
| **Hero** | Redes sociais flutuantes | URLs externas das redes | Válidas | Preservar (aguarda PEND-08) |
| **About** | Redes sociais | URLs externas das redes | Válidas | Preservar (aguarda PEND-08) |
| **Services / Pacotes** | 3 Botões "Quero um diagnóstico gratuito" | `#contact` | Âncora válida para o formulário | Preservar |
| **Blog** | 3 Botões "Saiba Mais" | `#` | **Placeholder (`href="#"`)** | Manter placeholder seguro sem navegação quebrada até que haja CMS/rotas internas de post. (**PEND-02**) |
| **Footer** | 5 Links da coluna Serviços | `#` | **Placeholder (`href="#"`)** | Transformar em âncoras para os serviços específicos (`#service`) ou manter `#`. (**PEND-02**) |
| **Footer** | Link "Contato" | `#` | **Placeholder (`href="#"`)** | Alterar para `#contact` (formulário). |
| **Footer** | Link "Blogs" | `#` | **Placeholder (`href="#"`)** | Alterar para `#blog` (seção existente). |
| **Footer** | Link "Politica e Privacidade" | `#` | **Placeholder (`href="#"`)** | Requer página ou modal dedicado para conformidade LGPD. (**PEND-12**) |

---

## 4. Segurança, Privacidade e LGPD

1. **Exposição de Chaves:** O código atual não possui nenhuma chave ou credencial exposta. Todos os scripts são estáticos e Server/Client components limpos.
2. **Variáveis de Ambiente:** Qualquer integração de disparo de email (ex: `RESEND_API_KEY`) ou webhook deverá ser isolada estritamente em `.env.local` e consumida exclusivamente em ambiente de servidor (Server Action ou Route Handler), nunca com prefixo `NEXT_PUBLIC_`.
3. **Validação de Entradas:**
   - Adicionar máscara e sanitização estrita no campo WhatsApp (`(XX) 9XXXX-XXXX`).
   - Implementar campo invisível honeypot (`<input type="text" name="b_website" className="hidden" tabIndex={-1} />`) para neutralizar spambots sem impactar o usuário real.
4. **Adequação à LGPD:**
   - O formulário coleta dados pessoais (Nome, Telefone, Empresa).
   - Recomenda-se adicionar abaixo do formulário de contato a cláusula: *"Seus dados serão utilizados exclusivamente pela Nexus Agency para envio do diagnóstico solicitado, em conformidade com nossa Política de Privacidade."*
   - Criação da página `/politica-de-privacidade` para suprir o link do rodapé.
