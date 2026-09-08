import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HOSPITAL_DATA, DEFAULT_INSURANCES } from '../data';
import { Phone, CheckCircle2, ArrowRight, Activity, Clock, ShieldCheck, MapPin, Microscope } from 'lucide-react';
import ProfessionalCarousel from '../components/ProfessionalCarousel';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { SiteSettings, Insurance } from '../types';
import { getGoogleDriveDirectLink } from '../lib/utils';

export default function LandingPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    logoUrl: HOSPITAL_DATA.logoUrl,
    whatsappNumber: HOSPITAL_DATA.whatsapp,
    whatsappFormatted: HOSPITAL_DATA.whatsappFormatted,
    address: HOSPITAL_DATA.address,
    heroTitle: 'Consultórios equipados e prontos para atender você!',
    heroSubtitle: 'Descubra mais sobre nossos serviços e especialidades. Tecnologia avançada e cuidado humano para sua família.',
    heroImage: 'https://images.unsplash.com/photo-1559839734-2b71f15367ef?auto=format&fit=crop&q=80&w=1000',
    contactEmail: '',
    yearsOfCredibility: 28
  });
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings);
        }

        // Fetch Insurances
        const q = query(collection(db, 'insurances'), orderBy('order', 'asc'));
        const insuranceSnap = await getDocs(q);
        if (!insuranceSnap.empty) {
          setInsurances(insuranceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insurance)));
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      {/* Hero Section - Inspired by the provided Flyer style */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-[40px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_bottom_left,#ffffff22,transparent_50%)]" />
            
            <div className="grid lg:grid-cols-12 gap-0 items-stretch min-h-[540px]">
              {/* Left Content (Blue Box Style) */}
              <div className="lg:col-span-7 p-8 sm:p-12 lg:p-20 flex flex-col justify-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-white/90 text-xs sm:text-sm font-bold backdrop-blur-sm mb-6 sm:mb-8">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
                    Atendimento Especializado em Juazeiro do Norte
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-[1.12] mb-6 sm:mb-8">
                    {settings.heroTitle}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 sm:mb-10 leading-relaxed max-w-xl">
                    {settings.heroSubtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
                    <a 
                      href={`https://wa.me/${settings.whatsappNumber}`}
                      className="bg-white text-blue-700 px-6 sm:px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-blue-50 hover:-translate-y-0.5 transition-all shadow-xl"
                    >
                      <Phone className="w-5 h-5" />
                      Agendar via WhatsApp
                    </a>
                    <a 
                      href="#especialidades"
                      className="bg-blue-700/30 text-white border border-white/20 px-6 sm:px-8 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-white/10 hover:-translate-y-0.5 transition-all backdrop-blur-md"
                    >
                      Nossos Serviços
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-6 sm:gap-8 border-t border-white/10 pt-6 sm:pt-8">
                    <div>
                      <p className="text-blue-200 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">Experiência</p>
                      <p className="text-white text-xl sm:text-2xl font-black">{settings.yearsOfCredibility} Anos</p>
                    </div>
                    <div>
                      <p className="text-blue-200 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">Atendimento</p>
                      <p className="text-white text-xl sm:text-2xl font-black">Emergência 24h</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Image (Doctor Style) */}
              <div className="lg:col-span-5 relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-transparent z-10" />
                <img 
                  src={getGoogleDriveDirectLink(settings.heroImage)} 
                  alt="Doctor" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71f15367ef?auto=format&fit=crop&q=80&w=1000';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties & Services Section */}
      <section id="especialidades" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start sm:items-end mb-12 lg:mb-16 gap-6 lg:gap-8">
            <div className="max-w-2xl">
              <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Excelência Médica</span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mt-2 mb-4 sm:mb-6">Nossas Especialidades e Serviços</h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                Oferecemos uma estrutura completa de alta complexidade para diagnósticos precisos e tratamentos eficazes no triângulo Crajubar.
              </p>
            </div>
            <img src={getGoogleDriveDirectLink(settings.logoUrl)} alt="Logo" className="h-16 opacity-10 hidden md:block" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {HOSPITAL_DATA.services.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="p-4 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3 sm:gap-4 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all cursor-default group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-neutral-700 font-bold text-xs sm:text-sm leading-tight">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Hospital Experience Section */}
      <section id="estrutura" className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] max-h-[520px] rounded-[40px] overflow-hidden shadow-2xl mx-auto w-full">
                <img 
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Hospital" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:-right-8 bg-blue-600 p-5 sm:p-10 rounded-[24px] sm:rounded-[32px] text-white shadow-2xl max-w-[180px] sm:max-w-[280px]">
                <p className="text-3xl sm:text-5xl font-black mb-1 sm:mb-2">{settings.yearsOfCredibility}</p>
                <p className="text-sm sm:text-xl font-bold leading-tight">Anos de credibilidade no Cariri.</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-8 leading-tight">
                Infraestrutura completa para sua <span className="text-blue-600">segurança.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { title: "UTI Completa", desc: "Alta tecnologia para casos complexos.", icon: Activity },
                  { title: "Emergência 24h", desc: "Pronto atendimento qualificado em qualquer horário.", icon: Clock },
                  { title: "Exames de Ponta", desc: "Diagnósticos por imagem com precisão absoluta.", icon: Microscope }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 sm:gap-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      <item.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                      <p className="text-neutral-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 sm:mt-12 p-6 sm:p-8 bg-white rounded-3xl border border-neutral-200 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-neutral-900">Localização Estratégica</p>
                  <p className="text-neutral-600 text-sm">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Staff Carousel */}
      <ProfessionalCarousel />

      {/* Insurance Plans Section */}
      <section id="conv" className="py-16 sm:py-24 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-4 block">Parcerias</span>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-10 lg:mb-16">Convênios Atendidos</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 lg:gap-20">
            {insurances.length > 0 ? insurances.map((insurance) => (
              <div key={insurance.id} className="flex items-center justify-center max-w-[90px] sm:max-w-[120px]">
                {insurance.logoUrl ? (
                  <img 
                    src={getGoogleDriveDirectLink(insurance.logoUrl)} 
                    alt={insurance.name}
                    className="max-h-12 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xl font-black text-neutral-300 select-none">{insurance.name}</span>
                )}
              </div>
            )) : DEFAULT_INSURANCES.map((insurance) => (
              <div key={insurance.id} className="flex items-center justify-center max-w-[90px] sm:max-w-[120px]">
                {insurance.logoUrl ? (
                  <img 
                    src={getGoogleDriveDirectLink(insurance.logoUrl)} 
                    alt={insurance.name}
                    className="max-h-12 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xl font-black text-neutral-300 select-none">{insurance.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-900 rounded-[40px] p-8 sm:p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col items-center">
              <img 
                src={getGoogleDriveDirectLink(settings.logoUrl)} 
                alt="Logo" 
                className="h-12 sm:h-16 mb-8 sm:mb-12 brightness-0 invert opacity-50" 
                referrerPolicy="no-referrer"
              />
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 sm:mb-8 max-w-3xl">
                Agende sua consulta com <span className="text-blue-500">nossos especialistas.</span>
              </h2>
              <p className="text-neutral-400 text-base sm:text-xl mb-8 sm:mb-12 max-w-2xl">
                Clique no botão abaixo para falar com nossa equipe de agendamento via WhatsApp.
              </p>
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`}
                className="bg-blue-600 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-2xl font-black text-lg sm:text-2xl shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                Agendar Agora
              </a>
              <p className="mt-8 sm:mt-12 text-neutral-500 font-bold uppercase tracking-widest text-xs sm:text-sm">
                Triagem Humanizada • Atendimento Ágil • {settings.whatsappFormatted}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
