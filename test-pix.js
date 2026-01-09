import { payload } from 'pix-payload';

// Testar geração de código PIX
const pixCode = payload({
  key: '05535232955',
  name: 'Lana Pet Care',
  city: 'Florianopolis',
  message: 'Pedido #12345678',
  amount: 55.00,
  transactionId: '12345678901234567890'
});

console.log('PIX Code gerado:');
console.log(pixCode);
console.log('\nTamanho:', pixCode.length);
console.log('Começa com 00020126?', pixCode.startsWith('00020126'));
