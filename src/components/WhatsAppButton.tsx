import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SiteSettings } from '../types';
import { HOSPITAL_DATA } from '../data';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState(HOSPITAL_DATA.whatsapp);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          if (data.whatsappNumber) {
            setWhatsappNumber(data.whatsappNumber);
          }
        }
      } catch (err) {
        console.error('Error fetching WhatsApp number:', err);
      }
    };

    fetchSettings();

    // Show button after a small delay
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[100] bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-[#25D366]/40 flex items-center justify-center group"
          aria-label="Contato via WhatsApp"
        >
          <div className="absolute right-full mr-4 hidden sm:block bg-white text-neutral-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Agendar Consulta
          </div>
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
          
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
