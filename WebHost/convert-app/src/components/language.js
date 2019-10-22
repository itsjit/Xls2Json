import React from 'react';
import { Select, Image } from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';

const Language = () => {
  const { t, i18n } = useTranslation();
  const setLanguage = (e, data) => {
    i18n.changeLanguage(data.value);
  };
  const languages = [
    {
      key: 'en',
      text: (
        <div>
          <Image src="/en64.png" avatar></Image>
          <span>{t('en')}</span>
        </div>
      ),
      value: 'en'
    },
    {
      key: 'cs',
      text: (
        <div>
          <Image src="/cs64.png" avatar></Image>
          <span>{t('cs')}</span>
        </div>
      ),
      value: 'cs'
    }
  ];

  return (
    <Select icon={null} compact options={languages} defaultValue={i18n.languages[0]} onChange={setLanguage}></Select>
  );
};

export default Language;
