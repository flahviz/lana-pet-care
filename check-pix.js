import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kdwpwbpyfvspzupgmebh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkd3B3YnB5ZnZzcHp1cGdtZWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzI0NDAsImV4cCI6MjA4MzQ0ODQ0MH0.fLkXPmw0LKg4hiXIXdQcmxQXKyFnDn5Wt08rQF5hrPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPixKey() {
  console.log('Verificando chave PIX no banco...\n');
  
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'pix_key');
  
  if (error) {
    console.error('Erro ao buscar:', error);
    return;
  }
  
  console.log('Dados encontrados:', JSON.stringify(data, null, 2));
  
  if (data && data.length > 0) {
    console.log('\n✅ Chave PIX encontrada!');
    console.log('Valor bruto:', data[0].value);
    console.log('Tipo:', typeof data[0].value);
    
    // Tentar fazer parse
    try {
      const parsed = JSON.parse(data[0].value);
      console.log('Valor parseado:', parsed);
    } catch (e) {
      console.log('Não é JSON válido, valor direto:', data[0].value);
    }
  } else {
    console.log('\n❌ Chave PIX NÃO encontrada no banco!');
  }
}

checkPixKey();
