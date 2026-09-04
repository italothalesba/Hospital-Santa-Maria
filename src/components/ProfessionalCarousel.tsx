import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'motion/react';
import { HOSPITAL_DATA } from '../data';
import { Specialist } from '../types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getGoogleDriveDirectLink } from '../lib/utils';

export default function ProfessionalCarousel() {
  const [specialists, setSpecialists] = useState<Specialist[]>(HOSPITAL_DATA.specialists);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: specialists.length > 3,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const q = query(collection(db, 'specialists'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setSpecialists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Specialist)));
        }
      } catch (err) {
        console.error('Error fetching specialists:', err);
      }
    };
    fetchSpecialists();
  }, []);

  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-24 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Corpo Clínico</span>
            <h2 className="text-4xl font-bold text-neutral-900 mt-2">Nossos Especialistas</h2>
            <p className="text-neutral-600 mt-4 max-w-xl">
              Uma equipe multidisciplinar de excelência, unindo experiência acadêmica e cuidado humanizado.
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-neutral-600 hover:text-blue-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all text-neutral-600 hover:text-blue-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {specialists.map((specialist, index) => (
              <div key={index} className="embla__slide flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%]">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 group hover:shadow-xl transition-all duration-500"
                >
                  {/* Image Frame (4:5 Ratio) */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100">
                    <img 
                      src={getGoogleDriveDirectLink(specialist.image)} 
                      alt={specialist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white/80 text-xs font-medium mb-1">Registro Profissional</p>
                      <p className="text-white text-sm font-bold uppercase tracking-wide">
                        {specialist.crm || specialist.cremec || specialist.crn}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {specialist.name}
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm mb-4 leading-tight">
                      {specialist.role}
                    </p>
                    <div className="h-px w-8 bg-neutral-200 mb-4 group-hover:w-full transition-all duration-500" />
                    <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                      {specialist.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
