import 'dotenv/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { auth, db } from '../src/lib/firebase';
import { HOSPITAL_DATA, PLAN_LOGOS } from '../src/data';

const EMAIL = process.env.FIREBASE_EMAIL;
const PASSWORD = process.env.FIREBASE_PASSWORD;

async function seed() {
  if (!EMAIL || !PASSWORD) {
    console.error('❌ Faltam as variáveis de ambiente FIREBASE_EMAIL e FIREBASE_PASSWORD.');
    console.error('   Crie um arquivo .env na raíz do projeto com:');
    console.error('   FIREBASE_EMAIL=seu@email.com');
    console.error('   FIREBASE_PASSWORD=sua-clave');
    console.error('   Depois execute: npm run seed:insurances');
    process.exit(1);
  }

  try {
    // Autenticação com a conta de admin
    await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log('✅ Autenticado corretamente.');

    // Verificar se já existem convenios
    const q = query(collection(db, 'insurances'), orderBy('order', 'asc'));
    const existing = await getDocs(q);
    if (!existing.empty) {
      console.log(`ℹ️  Já existem ${existing.size} convenios em Firebase. O seed não é executado para evitar duplicados.`);
      process.exit(0);
    }

    // Inserir os 13 convenios de HOSPITAL_DATA.plans
    const plans = HOSPITAL_DATA.plans;
    console.log(`🚀 Inserindo ${plans.length} convenios...`);

    for (let i = 0; i < plans.length; i++) {
      const name = plans[i];
      await addDoc(collection(db, 'insurances'), {
        name,
        logoUrl: PLAN_LOGOS[name] || '',
        order: i + 1,
      });
      console.log(`   ✓ ${i + 1}. ${name} (logo: ${PLAN_LOGOS[name] || 'sem logo'})`);
    }

    console.log('✅ Seed completado. Revise o painel de admin em /admin/insurances.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante o seed:', err);
    process.exit(1);
  }
}

seed();