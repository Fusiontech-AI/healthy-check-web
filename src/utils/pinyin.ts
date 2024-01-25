import Pinyin from 'js-pinyin';

export const getFirstLetter = (text: any) => {
  Pinyin.setOptions({ checkPolyphone: false, charCase: 1 });
  return Pinyin.getCamelChars(text)?.toUpperCase();
};
