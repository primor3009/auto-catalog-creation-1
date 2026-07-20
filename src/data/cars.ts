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
  comment?: string;
  isFeatured?: boolean;
}

export const bodyTypes = ['Все типы', 'Седан', 'Купе', 'Кроссовер', 'Внедорожник'];
export const fuels = ['Все', 'Бензин', 'Дизель', 'Электро', 'Гибрид'];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽';