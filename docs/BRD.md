# BRD — Business Requirements Document

## 1. Visão geral

### 1.1 Nome do projeto
Reconstrução do site institucional da Nexus Agency (Nexus | Agency). Confirmado oficialmente através da auditoria do site legado.

### 1.2 Resumo executivo
Reconstruir tecnicamente o site existente, atualmente desenvolvido com HTML, CSS e JavaScript, utilizando uma stack moderna baseada em Next.js, React, TypeScript, Tailwind CSS e GSAP. A reconstrução deve preservar a identidade visual, a mensagem, o conteúdo, as seções e as funcionalidades existentes, enquanto eleva a qualidade da navegação por meio de animações fluidas e sincronizadas com o scroll.

### 1.3 Problema / oportunidade
O site atual precisa de uma base de código mais organizada, sustentável e escalável, além de uma experiência de navegação mais fluida e expressiva. A oportunidade é modernizar a implementação sem perder o trabalho visual e de comunicação já realizado.

## 2. Objetivos de negócio

1. Manter a apresentação institucional e comercial da agência.
2. Preservar a clareza da proposta de valor e dos serviços apresentados no site atual.
3. Facilitar o contato e a conversão por meio dos canais existentes, especialmente WhatsApp.
4. Melhorar a percepção de qualidade por meio de uma experiência de navegação refinada.
5. Estabelecer uma base técnica organizada, sustentável e fácil de evoluir.
6. Permitir que diferentes agentes de desenvolvimento trabalhem de forma coordenada sem divergência de decisões.

## 3. Escopo

### 3.1 Dentro do escopo
- Auditoria do site atual e inventário de todas as páginas, seções, conteúdos e assets.
- Reconstrução em Next.js com App Router, React e TypeScript.
- Implementação de Tailwind CSS.
- Implementação de GSAP e ScrollTrigger.
- Animações vinculadas ao scroll, incluindo leitura progressiva de textos.
- Transições entre seções e revelação de imagens, quando adequadas ao design existente.
- Microinterações nos botões, com atenção especial aos botões de WhatsApp.
- Preservação dos links e funcionalidades existentes.
- Responsividade, acessibilidade, SEO técnico e otimização de performance.
- Testes e build de produção.

### 3.2 Fora do escopo, salvo autorização expressa
- Rebranding, redesign ou alteração da identidade visual.
- Criação de novas seções, serviços, campanhas ou textos comerciais.
- Alteração dos botões de redes sociais.
- Troca de imagens, logos, fontes ou conteúdo por material genérico.
- Mudanças em números de telefone, URLs, e-mails ou destinos de conversão.
- Integrações, CMS, backend ou banco de dados que não existam e não sejam necessários ao site atual.
- Publicação em produção ou alteração de domínio/hosting sem autorização.

## 4. Stakeholders e utilizadores

- **Responsável pelo projeto:** proprietário do site/agência.
- **Utilizadores finais:** visitantes do site, potenciais clientes e pessoas que procuram conhecer os serviços e entrar em contato.
- **Equipa de execução:** múltiplos agentes de IA e/ou ferramentas de desenvolvimento, sob coordenação do responsável pelo projeto.

Perfis específicos, segmentos de público e localização da agência devem ser extraídos do conteúdo existente, não presumidos.

## 5. Necessidades dos utilizadores

- Compreender rapidamente o que a agência faz.
- Navegar pelo conteúdo sem fricção.
- Conseguir ler textos com conforto, mesmo durante animações.
- Visualizar os serviços, trabalhos e informações apresentados no site atual.
- Encontrar e utilizar os canais de contato.
- Ter uma experiência consistente em desktop e dispositivos móveis.
- Conseguir navegar sem depender de animações ou hover.

## 6. Resultados esperados

- O novo site reproduz fielmente o conteúdo e a aparência do site de referência.
- A navegação tem movimento intencional e consistente.
- O destaque progressivo de texto acompanha o scroll nos dois sentidos.
- Os contatos existentes continuam funcionando.
- Os botões sociais permanecem inalterados.
- O projeto tem arquitetura clara e documentação suficiente para manutenção por diferentes agentes.
- O build de produção termina sem erros.

## 7. Indicadores de sucesso

- 100% das seções e conteúdos identificados no inventário estão presentes na versão reconstruída, salvo exclusão aprovada.
- 100% dos links e destinos de contato existentes foram preservados e testados.
- Nenhuma alteração não autorizada nos botões de redes sociais.
- Sem erros críticos de console, hidratação ou build.
- Layout funcional nos breakpoints definidos durante a auditoria.
- Animações reversíveis e consistentes ao rolar para cima e para baixo.
- Preferência por movimento reduzido respeitada.

## 8. Restrições e premissas

- O repositório e os arquivos do site atual são a referência primária.
- O conteúdo real e a estrutura de seções ainda precisam ser inventariados.
- A implementação deve priorizar a experiência nativa de scroll e não pode bloquear o usuário.
- A stack e as versões devem ser escolhidas de forma compatível no momento da implementação.
- Não presumir que a lista de seções de qualquer prompt de referência corresponda ao site real.

## 9. Riscos

| Risco | Mitigação |
|---|---|
| Perda de conteúdo durante a migração | Inventário antes da implementação e comparação seção a seção |
| Diferenças visuais entre original e rebuild | Capturas de referência e validação por viewport |
| Conflito entre GSAP, React e hidratação | Client Components isolados e limpeza de contextos |
| Animações pesadas em mobile | Estratégias responsivas e simplificação por breakpoint |
| Agentes implementarem padrões diferentes | `AGENTS.md`, documentos como fonte da verdade e tarefas delimitadas |
| Alteração acidental de links ou botões sociais | Inventário de destinos e testes de regressão |

## 10. Aprovações pendentes e decisões de negócio

- **Itens confirmados na auditoria:**
  - Nome oficial: Nexus Agency (confirmado).
  - Rotas: Rota única institucional `/` com navegação por âncoras (confirmado).
  - WhatsApp do site legado: `+55 61 99539-5969` (em uso; a troca pelo número informado pelo cliente está em `PEND-07`).
  - Identidade dos botões sociais: Preservação integral com rotação 3D inalterável (confirmado).

- **Pendências de decisão:** registradas **somente** na tabela PEND-xx do [TASKS.md](TASKS.md#pendências-de-decisão-registradas-para-alinhamento-com-responsável) — formulário de contato (`PEND-10`), links placeholder (`PEND-02`), inconsistências textuais e URL do Instagram (`PEND-03`, `PEND-04`), hospedagem/deploy (`PEND-06`) e divergências do conteúdo do cliente (`PEND-07` a `PEND-12`). Não replicar a lista aqui.
