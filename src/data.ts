import { Insurance } from './types';

export const HOSPITAL_DATA = {
  name: "Hospital Santa Maria",
  logoUrl: "https://drive.google.com/file/d/1ZmBqUD9eARkqgO7FMnHtN3KhTiYIRBag/view?usp=sharing",
  address: "Rua Conceição, 878 - Centro, Juazeiro do Norte - CE",
  whatsapp: "5588988425694",
  whatsappFormatted: "(88) 9 8842-5694",
  history: "28 anos de credibilidade e carinho cuidando da saúde das famílias da região.",
  plans: [
    "ISSEC", "Camed", "Life", "Capesaúde", "GEAP Saúde", 
    "Saúde CAIXA", "Bradesco Saúde", "Amil", "Famed Saúde", "Vitallis", 
    "CASSI", "Fachesf Saúde", "SulAmérica Saúde"
  ],
  services: [
    "Cirurgia Geral", "Cirurgia Vascular", "Clínica Médica", "Coloproctologia",
    "Colonoscopia", "Endoscopia Digestiva Alta", "Enfermaria", "Gastroenterologia",
    "Neurocirurgia", "Nutricionista", "Oncologia do Aparelho Digestivo", "Ortopedia",
    "Psiquiatria", "Raio-X", "Traumatologia", "Ultrassonografia com Doppler Venoso e Arterial",
    "Urologia", "UTI"
  ],
  specialists: [
    {
      name: "Dr. Eduardo Gouveia",
      crm: "4560 | RQE 17151 / 17152",
      role: "Cirurgia Geral e do Aparelho Digestivo",
      description: "Videolaparoscopia. Membro Titular do CBC e CBCD.",
      image: "/especialistas/dr-eduardo.jpg"
    },
    {
      name: "Dr. Eleazar",
      crm: "8000 | RQE 12229",
      role: "Urologista",
      description: "Médico pela UFPE. Título de Especialista pela SBU.",
      image: "/especialistas/dr-eleazar.jpg"
    },
    {
      name: "Dra. Mikaíle Alcântara",
      crn: "9869",
      role: "Nutricionista Clínica e Hospitalar",
      description: "Pós em Nutrição Clínica e Esportiva.",
      image: "/especialistas/dra-mikaile.jpg"
    },
    {
      name: "Dr. Diego Araújo",
      cremec: "15772",
      role: "Clínico Geral e Endoscopia",
      description: "Especialização em Endoscopia pela SERVIDDA - RS.",
      image: "/especialistas/dr-diego.jpg"
    },
    {
      name: "Dr. Márcio Araújo",
      crm: "7288 | RQE 2547",
      role: "Cirurgião Vascular e Endovascular",
      description: "Coordenador de Cirurgia Vascular do HRC. Doppler Colorido Vascular.",
      image: "/especialistas/dr-marcio.jpg"
    },
    {
      name: "Dr. Samir",
      crm: "16346 | RQE 7192",
      role: "Ortopedista",
      description: "Membro da SBOT e SBTO. Especialista pela FAMEMA - SP.",
      image: "/especialistas/dr-samir.jpg"
    },
    {
      name: "Dr. Edilson Lopes",
      crm: "CE 24964",
      role: "Ortopedia e Traumatologia",
      description: "Residência no Hospital da Restauração. Lesões Esportivas.",
      image: "/especialistas/dr-edilson.jpg"
    },
    {
      name: "Dr. Raynio Markfá",
      crm: "22132 | RQE 15539",
      role: "Ortopedia e Traumatologia",
      description: "Especialista em Joelho. Membro Titular da SBOT.",
      image: "/especialistas/dr-raynio.jpg"
    },
    {
      name: "Dr. Alison Nascimento",
      crm: "23032",
      role: "Ultrassonografia",
      description: "Médico Ultrassonografista pela ECUS. Musculoesquelética e Vascular.",
      image: "/especialistas/dr-alison.jpg"
    },
    {
      name: "Dr. Welber Meneses",
      crm: "17.092 | RQE 9002",
      role: "Especialista em Coluna",
      description: "Ortopedista e Traumatologista. Cirurgia de Endoscopia da Coluna.",
      image: "/especialistas/dr-welber.jpg"
    },
    {
      name: "Dra. Telma Rocha",
      crm: "8968 | RQE 2057",
      role: "Cirurgia Plástica",
      description: "Mamoplastia, Dermoplastia e Plástica em geral.",
      image: "/especialistas/dra-telma.jpg"
    },
    {
      name: "Especialista em Diagnóstico",
      role: "Exames e Imagem",
      description: "Equipe especializada em diagnósticos precisos via Endoscopia e Ultrassonografia.",
      image: "https://drive.google.com/file/d/1cWhxiL9-WfwGuhFTO807qHRkiipJan3W/view?usp=sharing"
    },
    {
      name: "Atendimento Humanizado",
      role: "Equipe Clínica",
      description: "Nossa equipe está pronta para acolher você e sua família com carinho e dedicação.",
      image: "https://drive.google.com/file/d/1Nm6ytkXoofweIdlHRwxQf-ARm_IYuR9s/view?usp=sharing"
    },
    {
      name: "Dr. Cícero Job",
      role: "Especialista",
      description: "",
      image: "/especialistas/dr-cicero-job.jpg"
    }
  ]
};

// Mapeia cada convênio (nome) para o caminho local da sua logo em /public/convenios
export const PLAN_LOGOS: Record<string, string> = {
  "ISSEC": "/convenios/ISSEC.jpg",
  "Camed": "/convenios/CAMED.png",
  "Life": "/convenios/life.png",
  "Capesaúde": "/convenios/Capesaude.png",
  "GEAP Saúde": "/convenios/geapsaude.png",
  "Saúde CAIXA": "/convenios/CAIXA.png",
  "Bradesco Saúde": "/convenios/bradesco-saude.png",
  "Amil": "/convenios/amil.png",
  "Famed Saúde": "/convenios/famed.png",
  "Vitallis": "/convenios/vitallis.png",
  "CASSI": "/convenios/cassi-seeklogo.png",
  "Fachesf Saúde": "/convenios/fachesf.png",
  "SulAmérica Saúde": "/convenios/SulAmerica.png"
};

export const DEFAULT_INSURANCES: Insurance[] = HOSPITAL_DATA.plans.map((name, idx) => ({
  id: `local-${idx}`,
  name,
  logoUrl: PLAN_LOGOS[name] || '',
  order: idx + 1,
}));
