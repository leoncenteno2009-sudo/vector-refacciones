export interface ScrollStateContent {
  id: string
  tag: string
  title: string
  description: string
  primaryCTA: { label: string; href: string }
  secondaryCTA?: { label: string; href: string }
  benefits?: string[]
  trustBadges?: Array<{ icon: string; label: string }>
}

export const scrollSequenceStates: ScrollStateContent[] = [
  {
    id: 'estado-01',
    tag: 'REFACCIONES Y DISTRIBUCIÓN AUTOMOTRIZ',
    title: 'La refacción correcta. En el momento exacto.',
    description:
      'Encuentra componentes compatibles para tu vehículo, taller o negocio sin perder tiempo.',
    primaryCTA: { label: 'Buscar una refacción', href: '#compatibilidad' },
    secondaryCTA: { label: 'Solicitar cotización', href: '#cotizacion' },
  },
  {
    id: 'estado-02',
    tag: '01 / ENCONTRAR',
    title: 'Compatibilidad sin perder tiempo.',
    description:
      'Filtra por marca, modelo, año y versión. Te ayudamos a confirmar la pieza correcta.',
    primaryCTA: { label: 'Verificar compatibilidad', href: '#compatibilidad' },
    secondaryCTA: { label: 'Hablar con un asesor', href: '#cotizacion' },
  },
  {
    id: 'estado-03',
    tag: '02 / DISTRIBUIR',
    title: 'Inventario que sigue el ritmo de tu negocio.',
    description:
      'Disponibilidad, preparación y distribución para talleres, refaccionarias y clientes particulares.',
    benefits: ['Envíos nacionales', 'Atención especializada', 'Cotización ágil'],
    primaryCTA: { label: 'Conocer distribución', href: '#distribucion' },
  },
  {
    id: 'estado-04',
    tag: '03 / INTEGRAR',
    title: 'Todo encaja. Tu vehículo vuelve al camino.',
    description:
      'Refacciones, compatibilidad y atención especializada reunidas para darte una solución completa.',
    benefits: ['Selección precisa', 'Soporte especializado', 'Respuesta ágil'],
    primaryCTA: { label: 'Solicitar cotización', href: '#cotizacion' },
  },
]

export const categoriesContent = [
  {
    id: 'motor',
    name: 'Motor',
    description: 'Pistones, cadenas de tiempo, empaques, bombas de aceite y sensores de cigüeñal.',
    icon: 'Cpu',
    tag: 'Rendimiento',
  },
  {
    id: 'frenos',
    name: 'Frenos',
    description: 'Discos hiperventilados, balatas cerámicas, cálipers y cilindros maestros.',
    icon: 'Disc',
    tag: 'Seguridad',
  },
  {
    id: 'suspension',
    name: 'Suspensión y Dirección',
    description: 'Amortiguadores, horquillas, terminales de dirección y barras estabilizadoras.',
    icon: 'Sliders',
    tag: 'Estabilidad',
  },
  {
    id: 'transmision',
    name: 'Transmisión',
    description: 'Kits de embrague, flechas homocinéticas, engranes y sensores de velocidad.',
    icon: 'Cog',
    tag: 'Potencia',
  },
  {
    id: 'electrico',
    name: 'Sistema Eléctrico',
    description: 'Alternadores, marchas, bobinas de encendido, bujías de iridio y módulos ECU.',
    icon: 'Zap',
    tag: 'Diagnóstico',
  },
  {
    id: 'enfriamiento',
    name: 'Enfriamiento',
    description: 'Radiadores, bombas de agua, termostatos y depósitos de anticongelante.',
    icon: 'Thermometer',
    tag: 'Protección',
  },
]

export const sampleVehicleData = {
  makes: ['Mazda', 'Toyota', 'Volkswagen', 'Nissan', 'Ford', 'Chevrolet', 'BMW', 'Honda'],
  models: {
    Mazda: ['Mazda 3', 'Mazda 6', 'CX-5', 'CX-30'],
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux'],
    Volkswagen: ['Jetta', 'Golf', 'Tiguan', 'Vento'],
    Nissan: ['Versa', 'Sentra', 'March', 'NP300'],
    Ford: ['Mustang', 'Ranger', 'Explorer', 'Focus'],
    Chevrolet: ['Aveo', 'Onix', 'S10', 'Tracker'],
    BMW: ['Serie 3', 'Serie 1', 'X3', 'X5'],
    Honda: ['Civic', 'CR-V', 'Accord', 'Fit'],
  },
  years: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'],
  engines: ['2.0L 4Cyl', '2.5L Turbo', '1.6L Nat', '1.4L TSI', '3.5L V6'],
}

export const quoteStepsContent = [
  {
    number: '01',
    title: 'Comparte los datos de tu vehículo',
    description: 'Ingresa la marca, modelo, año y la pieza o síntoma que requieres.',
  },
  {
    number: '02',
    title: 'Confirmamos la compatibilidad',
    description: 'Nuestro equipo valida las especificaciones técnicas exactas del fabricante.',
  },
  {
    number: '03',
    title: 'Recibe una propuesta y entrega',
    description: 'Te enviamos las opciones disponibles en inventario con tiempos de envío.',
  },
]
