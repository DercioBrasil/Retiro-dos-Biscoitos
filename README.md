# Sistema de Reservas para Alojamento Local

Uma página web moderna e responsiva para alojamentos locais, permitindo que os clientes façam reservas diretamente no site.

## 🚀 Funcionalidades

- **Design Moderno**: Interface atraente e profissional
- **Sistema de Reservas**: Formulário completo com validações
- **Calendário Interativo**: Visualização de disponibilidade e seleção de datas
- **Cálculo Automático**: Preço total calculado automaticamente
- **Armazenamento Local**: Reservas salvas no navegador
- **Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop
- **Validações**: Prevenção de reservas conflitantes e validação de datas

## 📁 Estrutura do Projeto

```
.
├── index.html      # Página principal
├── styles.css      # Estilos e design
├── script.js       # Lógica de reservas e interatividade
└── README.md       # Documentação
```

## 🎯 Como Usar

1. **Abrir a Página**: Abra o arquivo `index.html` no seu navegador
2. **Navegar**: Use o menu de navegação para explorar as seções
3. **Fazer Reserva**:
   - Preencha o formulário de reserva
   - Selecione as datas de check-in e check-out
   - Escolha o número de hóspedes
   - Confirme a reserva

## ⚙️ Personalização

### Alterar Preço por Noite

No arquivo `script.js`, linha 2:

```javascript
const PRICE_PER_NIGHT = 50; // Altere para o seu preço
```

### Personalizar Informações de Contacto

No arquivo `index.html`, seção de contacto:

```html
<p><strong>📧 Email:</strong> contacto@alojamento.local</p>
<p><strong>📞 Telefone:</strong> +351 123 456 789</p>
<p><strong>📍 Morada:</strong> Rua Exemplo, 123, Portugal</p>
```

### Adicionar Imagens Reais

Substitua os placeholders na galeria e seção "Sobre" por imagens reais do seu alojamento.

## 🔧 Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS e Grid/Flexbox)
- JavaScript (Vanilla JS)
- LocalStorage para persistência de dados
- Google Fonts (Poppins)

## 📱 Responsividade

O site é totalmente responsivo e adapta-se a:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 💾 Armazenamento de Dados

As reservas são armazenadas localmente no navegador usando `localStorage`. Para produção, recomenda-se integrar com um backend para:
- Armazenamento seguro em servidor
- Envio de emails de confirmação
- Gestão de reservas
- Integração com sistemas de pagamento

## 🎨 Características de Design

- Paleta de cores moderna e profissional
- Animações suaves
- Interface intuitiva
- Feedback visual para ações do utilizador
- Modal de confirmação elegante

## 📝 Próximos Passos Sugeridos

- Integração com backend (Node.js, PHP, etc.)
- Sistema de pagamento online
- Envio de emails de confirmação
- Painel administrativo para gestão de reservas
- Upload de imagens reais do alojamento
- Sistema de avaliações
- Múltiplos idiomas

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente.

---

Desenvolvido com ❤️ para alojamentos locais
