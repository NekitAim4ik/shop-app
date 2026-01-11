import { Navigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './Protected.css';
import Header from './Header';
import TemplateSelection from './TemplateSelection';
import SiteEditor from './SiteEditor';
import MySites from './MySites';

export interface Site {
  id: string;
  name: string;
  template: string;
  data: {
    title: string;
    description: string;
    logo?: string;
    categories: Category[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  stock: number;
}

const Protected = () => {
  const accessToken = localStorage.getItem('accessToken');
  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem('sites');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const saveSites = (newSites: Site[]) => {
    setSites(newSites);
    localStorage.setItem('sites', JSON.stringify(newSites));
  };

  const createSite = (name: string, template: string) => {
    const newSite: Site = {
      id: Date.now().toString(),
      name,
      template,
      data: {
        title: name,
        description: '',
        categories: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSites([...sites, newSite]);
    setEditingSiteId(newSite.id);
  };

  const updateSite = (siteId: string, data: Partial<Site>) => {
    const updated = sites.map(site =>
      site.id === siteId
        ? { ...site, ...data, updatedAt: new Date().toISOString() }
        : site
    );
    saveSites(updated);
  };

  const deleteSite = (siteId: string) => {
    saveSites(sites.filter(s => s.id !== siteId));
  };

  if (editingSiteId) {
    const site = sites.find(s => s.id === editingSiteId);
    if (!site) return null;

    return (
      <SiteEditor
        site={site}
        onSave={(data) => updateSite(editingSiteId, { data })}
        onClose={() => setEditingSiteId(null)}
      />
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <TemplateSelection
                  onSelectTemplate={createSite}
                  sitesCount={sites.length}
                />
              }
            />
            <Route
              path="/my-sites"
              element={
                <MySites
                  sites={sites}
                  onEdit={setEditingSiteId}
                  onDelete={deleteSite}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Protected;