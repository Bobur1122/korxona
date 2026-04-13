const CATEGORY_KEY_MAP = {
  'Issiqxona plyonkasi': 'categoryGreenhouseFilm',
  'Termo-usadoz plyonka': 'categoryShrinkFilm',
  'Polietilen paketlar': 'categoryPolyethyleneBags',
  'PET kapsulalar': 'categoryPetCapsules',
  'Tom yopish materiallari': 'categoryRoofingMaterials',
  'Bitum-polimer mastika': 'categoryBitumenMastic',

  oddiy: 'categoryPlainFilm',
  uv_plyonka: 'categoryUvFilm',
  kop_qavatli: 'categoryMultiLayerFilm',
  maxsus: 'categorySpecialFilm',
  boshqa: 'categoryOther',
};

export const CATALOG_CATEGORY_VALUES = [
  'Issiqxona plyonkasi',
  'Termo-usadoz plyonka',
  'Polietilen paketlar',
  'PET kapsulalar',
  'Tom yopish materiallari',
  'Bitum-polimer mastika',
];

export function getCategoryLabel(t, value) {
  const key = CATEGORY_KEY_MAP[value];
  return key ? t(key) : value;
}
