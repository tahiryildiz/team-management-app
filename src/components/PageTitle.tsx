import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface PageTitleProps {
  pageName: string;
  includeCompanyName?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({ pageName, includeCompanyName = false }) => {
  const { settings } = useSettings();

  if (includeCompanyName && settings.companyName) {
    return (
      <h1 className="text-2xl font-bold mb-4">
        {`${settings.companyName} ${pageName}`}
      </h1>
    );
  }

  return <h1 className="text-2xl font-bold mb-4">{pageName}</h1>;
};

export default PageTitle;
