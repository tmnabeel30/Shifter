import { useState } from 'react';
import { Bell, Mail, Smartphone, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationSettingsData {
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  types: {
    file_uploaded: boolean;
    invoice_sent: boolean;
    invoice_paid: boolean;
    project_update: boolean;
    deadline_approaching: boolean;
    message_received: boolean;
    payment_reminder: boolean;
    system_alert: boolean;
  };
}

function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsData>({
    email: true,
    push: true,
    inApp: true,
    frequency: 'immediate',
    types: {
      file_uploaded: true,
      invoice_sent: true,
      invoice_paid: true,
      project_update: true,
      deadline_approaching: true,
      message_received: true,
      payment_reminder: true,
      system_alert: true,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // In real app, save to Firebase
      console.log('Saving notification settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Notification settings updated successfully!');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (key: keyof NotificationSettingsData['types']) => {
    setSettings(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [key]: !prev.types[key],
      },
    }));
  };

  const toggleChannel = (channel: 'email' | 'push' | 'inApp') => {
    setSettings(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
        <p className="text-gray-600">Manage how you receive notifications and updates.</p>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Notification Channels</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <button
              onClick={() => toggleChannel('email')}
              className="flex items-center"
            >
              {settings.email ? (
                <ToggleRight className="h-6 w-6 text-primary-600" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications on your device</p>
              </div>
            </div>
            <button
              onClick={() => toggleChannel('push')}
              className="flex items-center"
            >
              {settings.push ? (
                <ToggleRight className="h-6 w-6 text-primary-600" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">In-App Notifications</p>
                <p className="text-sm text-gray-500">Show notifications within the app</p>
              </div>
            </div>
            <button
              onClick={() => toggleChannel('inApp')}
              className="flex items-center"
            >
              {settings.inApp ? (
                <ToggleRight className="h-6 w-6 text-primary-600" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Frequency */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Notification Frequency</h4>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How often should we send you notifications?
          </label>
          <select
            value={settings.frequency}
            onChange={(e) => setSettings(prev => ({ ...prev, frequency: e.target.value as any }))}
            className="input-field"
          >
            <option value="immediate">Immediate</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Notification Types */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Notification Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.types).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
                <p className="text-xs text-gray-500">
                  {key === 'file_uploaded' && 'When files are uploaded to your projects'}
                  {key === 'invoice_sent' && 'When new invoices are sent'}
                  {key === 'invoice_paid' && 'When invoices are paid'}
                  {key === 'project_update' && 'When projects are updated'}
                  {key === 'deadline_approaching' && 'When deadlines are approaching'}
                  {key === 'message_received' && 'When you receive new messages'}
                  {key === 'payment_reminder' && 'Payment reminders and updates'}
                  {key === 'system_alert' && 'Important system notifications'}
                </p>
              </div>
              <button
                onClick={() => toggleSetting(key as keyof NotificationSettingsData['types'])}
                className="flex items-center"
              >
                {value ? (
                  <ToggleRight className="h-5 w-5 text-primary-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setSettings({
              email: true,
              push: true,
              inApp: true,
              frequency: 'immediate',
              types: {
                file_uploaded: true,
                invoice_sent: true,
                invoice_paid: true,
                project_update: true,
                deadline_approaching: true,
                message_received: true,
                payment_reminder: true,
                system_alert: true,
              },
            });
          }}
          className="btn-secondary"
        >
          Reset to Default
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;




