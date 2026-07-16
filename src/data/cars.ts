export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  bodyType: 'Седан' | 'Купе' | 'Кроссовер' | 'Внедорожник';
  fuel: 'Бензин' | 'Дизель' | 'Электро' | 'Гибрид';
  power: number;
  acceleration: number;
  drive: string;
  cover: string;
  gallery: string[];
  video: string;
  tag?: string;
}

const IMG_SPORT = 'https://cdn.poehali.dev/projects/a21d35f2-eff0-4520-9bb8-ba9f7f42af8f/files/66ab5267-2cae-4099-8e91-800e5fb8ed51.jpg';
const IMG_SUV = 'https://cdn.poehali.dev/projects/a21d35f2-eff0-4520-9bb8-ba9f7f42af8f/files/3bf6b3d9-41a6-4383-8869-13ce82b0b79b.jpg';
const IMG_COUPE = 'https://cdn.poehali.dev/projects/a21d35f2-eff0-4520-9bb8-ba9f7f42af8f/files/48d04634-e7c2-44da-9df0-766570fb9146.jpg';

const DEMO_VIDEO = 'https://cdn.coverr.co/videos/coverr-a-car-driving-on-a-road-8322/1080p.mp4';

export const cars: Car[] = [
  {
    id: 1,
    brand: 'Aurora',
    model: 'GT Phantom',
    year: 2024,
    price: 12500000,
    bodyType: 'Купе',
    fuel: 'Бензин',
    power: 620,
    acceleration: 3.2,
    drive: 'Полный',
    cover: IMG_SPORT,
    gallery: [IMG_SPORT, IMG_COUPE, IMG_SUV],
    video: DEMO_VIDEO,
    tag: 'Хит',
  },
  {
    id: 2,
    brand: 'Vela',
    model: 'X Electric',
    year: 2025,
    price: 8900000,
    bodyType: 'Кроссовер',
    fuel: 'Электро',
    power: 480,
    acceleration: 4.1,
    drive: 'Полный',
    cover: IMG_SUV,
    gallery: [IMG_SUV, IMG_SPORT, IMG_COUPE],
    video: DEMO_VIDEO,
    tag: 'Новинка',
  },
  {
    id: 3,
    brand: 'Nero',
    model: 'Coupe RS',
    year: 2024,
    price: 6400000,
    bodyType: 'Купе',
    fuel: 'Гибрид',
    power: 390,
    acceleration: 4.8,
    drive: 'Задний',
    cover: IMG_COUPE,
    gallery: [IMG_COUPE, IMG_SPORT, IMG_SUV],
    video: DEMO_VIDEO,
  },
  {
    id: 4,
    brand: 'Aurora',
    model: 'S-Line Sedan',
    year: 2023,
    price: 5200000,
    bodyType: 'Седан',
    fuel: 'Дизель',
    power: 265,
    acceleration: 6.3,
    drive: 'Полный',
    cover: IMG_SPORT,
    gallery: [IMG_SPORT, IMG_SUV, IMG_COUPE],
    video: DEMO_VIDEO,
  },
  {
    id: 5,
    brand: 'Vela',
    model: 'Terra Off-Road',
    year: 2025,
    price: 9700000,
    bodyType: 'Внедорожник',
    fuel: 'Дизель',
    power: 420,
    acceleration: 5.9,
    drive: 'Полный',
    cover: IMG_SUV,
    gallery: [IMG_SUV, IMG_COUPE, IMG_SPORT],
    video: DEMO_VIDEO,
    tag: 'Топ продаж',
  },
  {
    id: 6,
    brand: 'Nero',
    model: 'City E',
    year: 2025,
    price: 3900000,
    bodyType: 'Кроссовер',
    fuel: 'Электро',
    power: 210,
    acceleration: 7.2,
    drive: 'Передний',
    cover: IMG_COUPE,
    gallery: [IMG_COUPE, IMG_SUV, IMG_SPORT],
    video: DEMO_VIDEO,
  },
];

export const brands = ['Все марки', 'Aurora', 'Vela', 'Nero'];
export const bodyTypes = ['Все типы', 'Седан', 'Купе', 'Кроссовер', 'Внедорожник'];
export const fuels = ['Все', 'Бензин', 'Дизель', 'Электро', 'Гибрид'];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽';