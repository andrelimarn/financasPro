# FinançasPro — Controle Financeiro para Microempreendedores

Este aplicativo é um MVP (Minimum Viable Product) de controle de contas a pagar e receber, desenvolvido especificamente como projeto de conclusão de disciplina para o curso de **Análise e Desenvolvimento de Sistemas (ADS) da Faculdade Estácio**.

O aplicativo foi projetado para auxiliar pequenos empreendedores e autônomos que trabalham com vendas a gerenciar suas receitas e despesas com simplicidade, foco em segurança e uma interface de alta usabilidade.

---

## 🚀 Tecnologias Utilizadas

O projeto utiliza um conjunto de tecnologias modernas e de alto padrão do mercado de desenvolvimento mobile:

*   **React Native / Expo (SDK 54):** Framework para desenvolvimento mobile multiplataforma, garantindo performance nativa e ciclo de desenvolvimento ágil.
*   **Expo Router:** Sistema de roteamento baseado em arquivos para navegação limpa e fluida (estilo Next.js).
*   **Supabase:** Backend-as-a-Service (BaaS) em nuvem para autenticação robusta e banco de dados relacional (PostgreSQL) em tempo real.
*   **Expo Secure Store:** Criptografia em nível de hardware (Keychain no iOS e Keystore no Android) para persistência segura das sessões de login dos usuários.
*   **TypeScript:** Garantia de tipagem estática forte, prevenindo erros em tempo de execução e aumentando a manutenibilidade do código.

---

## 🔒 Diferenciais de Arquitetura e Segurança

Para atingir os exigentes padrões acadêmicos e profissionais, o app foi arquitetado com foco em boas práticas de engenharia de software:

1.  **Row Level Security (RLS) no Supabase:** Toda a segurança de acesso a dados é blindada no próprio banco de dados. Os usuários possuem isolamento completo (um usuário nunca consegue ler, editar ou excluir contas ou categorias que pertençam a outro).
2.  **Criptografia Nativa de Tokens (AES-256):** Diferente de apps comuns que guardam credenciais em texto limpo com `AsyncStorage`, o FinançasPro utiliza o `expo-secure-store` para encriptar e guardar as chaves de acesso diretamente no chip de segurança do aparelho celular.
3.  **Triggers e Automações em Banco (PL/pgSQL):** Cadastros automáticos e injeção instantânea de categorias financeiras padrões ocorrem diretamente no banco por meio de triggers reativas no momento do cadastro de uma nova conta.
4.  **Interface Otimizada (Design System):** Layout leve baseado em cores claras e tons de verde esmeralda, com fontes escaláveis, máscara monetária dinâmica e tratamento preventivo de quebras de layout.

---

## 📱 Funcionalidades Principais do MVP

*   **Autenticação Completa:** Cadastro de conta e login seguro com e-mail e senha.
*   **Dashboard Inteligente:**
    *   Cards de resumo com redimensionamento automático de texto para valores grandes.
    *   Atalhos táteis que levam do resumo diretamente às listagens.
    *   **Painel de Alertas Dinâmico:** Alertas coloridos que alertam o empreendedor em tempo real sobre despesas vencidas, despesas a vencer no dia de hoje e receitas que ele deve cobrar/receber hoje.
*   **Gerenciador de Contas (CRUD completo):**
    *   Cadastro de Contas a Pagar e Receber com máscara de valor monetário automática (digitação sem vírgulas).
    *   Calendário integrado para escolher datas de vencimento.
    *   Confirmação de Pagamento/Recebimento por meio de **Modais Customizados Interativos**, permitindo escolher a data exata da transação.
*   **Gerenciador de Categorias:** Organização por chips com cores customizadas para classificação de despesas/receitas.

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
*   Node.js (versão 18 ou superior)
*   NPM instalado
*   Aplicativo **Expo Go** instalado no seu celular Android para testar fisicamente

### Passo 1: Instalar as dependências
Na pasta raiz do projeto, execute o comando:
```bash
npm install
```

### Passo 2: Configurar o Banco de Dados
1. Crie um projeto no [Supabase](https://supabase.com).
2. Vá em **SQL Editor**, cole todo o conteúdo do arquivo localizado em `/supabase/setup.sql` deste repositório e execute-o (*Run*). Isso criará a estrutura de tabelas, triggers e RLS.

### Passo 3: Configurar as Variáveis de Ambiente
1. Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`.
2. Insira a URL e a Anon Key públicas do seu projeto Supabase:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
   ```

### Passo 4: Iniciar o Aplicativo
Execute o servidor de desenvolvimento utilizando a rede de túnel seguro do Expo:
```bash
npx expo start --tunnel
```
Escaneie o QR Code exibido no terminal com a câmera do seu celular ou diretamente através do aplicativo **Expo Go** e teste o aplicativo instantaneamente!

---

## 🎓 Autoria
*   **Curso:** Análise e Desenvolvimento de Sistemas (ADS)
*   **Faculdade:** Estácio de Sá
