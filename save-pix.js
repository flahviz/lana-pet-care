import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kdwpwbpyfvspzupgmebh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkd3B3YnB5ZnZzcHp1cGdtZWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NzI0NDAsImV4cCI6MjA4MzQ0ODQ0MH0.fLkXPmw0LKg4hiXIXdQcmxQXKyFnDn5Wt08rQF5hrPc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function savePixKey() {
  console.log('Salvando chave PIX no banco...\n');
  
  const pixKey = '05535232955';
  
  const { data, error } = await supabase
    .from('settings')
    .upsert({
      key: 'pix_key',
      value: JSON.stringify(pixKey),
      description: 'Business setting: pix_key'
    }, { onConflict: 'key' })
    .select();
  
  if (error) {
    console.error('❌ Erro ao salvar:', error);
    return;
  }
  
  console.log('✅ Chave PIX salva com sucesso!');
  console.log('Dados salvos:', JSON.stringify(data, null, 2));
  
  // Verificar se foi salvo
  const { data: checkData } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'pix_key')
    .single();
  
  console.log('\nVerificação:');
  console.log('Valor salvo:', checkData?.value);
  
  try {
    const parsed = JSON.parse(checkData?.value);
    console.log('Valor parseado:', parsed);
  } catch (e) {
    console.log('Valor direto:', checkData?.value);
  }
}

savePixKey();
