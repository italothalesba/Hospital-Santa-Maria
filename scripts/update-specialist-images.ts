import 'dotenv/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { auth, db } from '../src/lib/firebase';
import { HOSPITAL_DATA } from '../src/data';

const EMAIL = process.env.FIREBASE_EMAIL;
const PASSWORD = process.env.FIREBASE_PASSWORD;

const isLocalImage = (url: string) => url.startsWith('/');

async function syncSpecialistImages() {
  if (!EMAIL || !PASSWORD) {
    console.error('❌ Faltam as variáveis de ambiente FIREBASE_EMAIL e FIREBASE_PASSWORD.');
    console.error('   Crie um arquivo .env no raíz do projeto com:');
    console.error('   FIREBASE_EMAIL=seu@email.com');
    console.error('   FIREBASE_PASSWORD=sua-senha');
    console.error('   Depois execute: npm run update:specialist-images');
    process.exit(1);
  }

  try {
    // Autenticação com a conta de admin
    await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
    console.log('✅ Autenticado corretamente.');

    const specialistsWithLocalImage = HOSPITAL_DATA.specialists.filter(s => isLocalImage(s.image));

    let updated = 0;
    let created = 0;
    let skipped = 0;

    for (const spec of specialistsWithLocalImage) {
      // Busca o especialista no Firestore pelo nome
      const q = query(collection(db, 'specialists'), where('name', '==', spec.name), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, {
          image: spec.image,
          name: spec.name,
          role: spec.role,
          description: spec.description,
          ...(spec.crm ? { crm: spec.crm } : {}),
          ...(spec.cremec ? { cremec: spec.cremec } : {}),
          ...(spec.crn ? { crn: spec.crn } : {}),
        });
        updated++;
        console.log(`   ✓ Atualizado: ${spec.name} → ${spec.image}`);
      } else {
        // Especialista novo (ex.: Dr. Cícero Job) que ainda não está no Firestore
        await addDoc(collection(db, 'specialists'), {
          name: spec.name,
          role: spec.role,
          description: spec.description,
          image: spec.image,
          ...(spec.crm ? { crm: spec.crm } : {}),
          ...(spec.cremec ? { cremec: spec.cremec } : {}),
          ...(spec.crn ? { crn: spec.crn } : {}),
          order: HOSPITAL_DATA.specialists.length + 1,
        });
        created++;
        console.log(`   ➕ Criado: ${spec.name} → ${spec.image}`);
      }
    }

    console.log(`\n✅ Sincronização completada. Atualizados: ${updated}, Criados: ${created}, Ignorados: ${skipped}.`);
  } catch (err) {
    console.error('❌ Erro durante a sincronização:', err);
    process.exit(1);
  }
}

syncSpecialistImages();