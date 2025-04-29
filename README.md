# Sistema de Gestão de Serviços

Este é um sistema web simples para gerenciar serviços prestados e notificar clientes sobre manutenções futuras.

## Funcionalidades

- Registro de serviços prestados
- Cadastro de informações do cliente
- Agendamento de manutenções futuras
- Notificações automáticas para manutenções próximas
- Armazenamento local dos dados
- Interface responsiva e amigável

## Como usar

1. Abra o arquivo `index.html` em um navegador web moderno
2. Para registrar um novo serviço:
   - Preencha o formulário com os dados do cliente e do serviço
   - Defina a data da próxima manutenção
   - Clique em "Registrar Serviço"
3. Os serviços registrados aparecerão na lista abaixo do formulário
4. O sistema mostrará alertas para manutenções que estejam a 30 dias ou menos de acontecer
5. Você pode excluir serviços clicando no botão "Excluir"

## Requisitos

- Navegador web moderno com suporte a:
  - JavaScript ES6+
  - LocalStorage
  - Notificações web (opcional)

## Armazenamento

Os dados são armazenados localmente no navegador usando LocalStorage. Isso significa que:
- Os dados persistem mesmo após fechar o navegador
- Os dados são específicos para cada dispositivo/navegador
- Não é necessário um servidor para funcionar

## Notificações

O sistema suporta notificações web para alertar sobre manutenções próximas. Para habilitar:
1. Permita notificações quando o navegador solicitar
2. As notificações aparecerão quando houver manutenções programadas para os próximos 30 dias 