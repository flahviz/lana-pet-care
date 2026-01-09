import { payload } from 'pix-payload';

// Simular um bookingId real
const bookingId = 'abc-123-def-456-ghi';
const totalPrice = 55.00;

// Formatar valor com exatamente 2 casas decimais
const formattedAmount = Number(totalPrice).toFixed(2);

// TransactionId: máximo 25 caracteres, apenas alfanuméricos
const txId = bookingId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);

console.log('Valores formatados:');
console.log('Amount:', formattedAmount);
console.log('TxId:', txId, '(length:', txId.length + ')');

// Testar geração de código PIX
const pixCode = payload({
  key: '05535232955',
  name: 'Lana Pet Care',
  city: 'Florianopolis',
  message: `Pedido ${bookingId.slice(0, 8)}`, // Sem #
  amount: parseFloat(formattedAmount),
  transactionId: txId
});

console.log('\nPIX Code gerado:');
console.log(pixCode);
console.log('\nTamanho:', pixCode.length);
console.log('Começa com 00020126?', pixCode.startsWith('00020126'));
