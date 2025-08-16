import { useState, ChangeEvent, CSSProperties } from 'react';
import { Upload, Image as ImageIcon, Save, Eye } from 'lucide-react';

interface BrandingSettingsData {
  companyName: string;
  logo: File | null;
  primaryColor: string;
  secondaryColor: string;
  favicon: File | null;
  customCSS: string;
}

function BrandingSettings() {
  const [settings, setSettings] = useState<BrandingSettingsData>({
    companyName: 'Shifter',
    logo: null,
    primaryColor: '#3B82F6',
    secondaryColor: '#1F2937',
    favicon: null,
    customCSS: '',
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSettings({ ...settings, logo: file });
    }
  };

  const handleFaviconUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSettings({ ...settings, favicon: file });
    }
  };

  const handleSave = () => {
    // In real app, save to Firebase
    console.log('Saving branding settings:', settings);
  };

  const getLogoPreview = () => {
    if (settings.logo) {
      return URL.createObjectURL(settings.logo);
    }
    return null;
  };

  const getFaviconPreview = () => {
    if (settings.favicon) {
      return URL.createObjectURL(settings.favicon);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Branding Settings</h2>
        <p className="text-gray-600">Customize your portal's appearance and branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="input-field"
              placeholder="Your Company Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center space-x-4">
              <label className="btn-secondary flex items-center cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {getLogoPreview() && (
                <img
                  src={getLogoPreview()!}
                  alt="Logo preview"
                  className="h-12 w-auto"
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 200x60px, PNG or SVG format
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="input-field flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  className="input-field flex-1"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Favicon
            </label>
            <div className="flex items-center space-x-4">
              <label className="btn-secondary flex items-center cursor-pointer">
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Favicon
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconUpload}
                  className="hidden"
                />
              </label>
              {getFaviconPreview() && (
                <img
                  src={getFaviconPreview()!}
                  alt="Favicon preview"
                  className="h-8 w-8"
                />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 32x32px, ICO or PNG format
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom CSS
            </label>
            <textarea
              value={settings.customCSS}
              onChange={(e) => setSettings({ ...settings, customCSS: e.target.value })}
              className="input-field h-32 font-mono text-sm"
              placeholder="/* Add your custom CSS here */"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add custom styles to further customize your portal
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div 
              className="bg-white border border-gray-200 rounded-lg p-6"
              style={{
                '--primary-color': settings.primaryColor,
                '--secondary-color': settings.secondaryColor,
              } as CSSProperties}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getLogoPreview() ? (
                    <img
                      src={getLogoPreview()!}
                      alt="Logo"
                      className="h-8 w-auto"
                    />
                  ) : (
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  )}
                  <h1 className="text-xl font-bold" style={{ color: settings.primaryColor }}>
                    {settings.companyName}
                  </h1>
                </div>
                <div className="text-sm text-gray-500">Portal Preview</div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${settings.primaryColor}10` }}>
                  <h3 className="font-medium mb-2" style={{ color: settings.primaryColor }}>
                    Welcome to your portal
                  </h3>
                  <p className="text-sm text-gray-600">
                    This is how your portal will look with the selected branding.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    className="px-4 py-2 rounded text-white text-sm font-medium"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button 
                    className="px-4 py-2 rounded text-sm font-medium border"
                    style={{ 
                      borderColor: settings.secondaryColor,
                      color: settings.secondaryColor 
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandingSettings;

