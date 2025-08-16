import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Key, 
  Smartphone, 
  Globe,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySettingsState {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
  dataExport: boolean;
  accountDeletion: boolean;
}

function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettingsState>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    dataExport: false,
    accountDeletion: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordForm>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: PasswordForm) => {
    try {
      setIsLoading(true);
      // In real app, update password in Firebase
      console.log('Updating password:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password updated successfully!');
      reset();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySettingChange = (key: keyof SecuritySettingsState, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSecuritySettings = async () => {
    try {
      setIsLoading(true);
      // In real app, save to Firebase
      console.log('Saving security settings:', securitySettings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Security settings updated successfully!');
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('Failed to update security settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="text-gray-600">Manage your account security and privacy preferences.</p>
      </div>

      {/* Change Password */}
      <div className="card">
        <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('currentPassword', { required: 'Current password is required' })}
                type={showCurrentPassword ? 'text' : 'password'}
                className="input-field pl-10 pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                type={showNewPassword ? 'text' : 'password'}
                className="input-field pl-10 pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === newPassword || 'Passwords do not match',
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-field pl-10 pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Preferences */}
      <div className="card">
        <h4 className="text-md font-medium text-gray-900 mb-4">Security Preferences</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
            </div>
            <button
              onClick={() => handleSecuritySettingChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
              className={`px-3 py-1 text-sm rounded-full ${
                securitySettings.twoFactorAuth
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
              </div>
            </div>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
              className="input-field w-32"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Login Notifications</p>
                <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
              </div>
            </div>
            <button
              onClick={() => handleSecuritySettingChange('loginNotifications', !securitySettings.loginNotifications)}
              className={`px-3 py-1 text-sm rounded-full ${
                securitySettings.loginNotifications
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {securitySettings.loginNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Suspicious Activity Alerts</p>
                <p className="text-sm text-gray-500">Get alerts for unusual account activity</p>
              </div>
            </div>
            <button
              onClick={() => handleSecuritySettingChange('suspiciousActivityAlerts', !securitySettings.suspiciousActivityAlerts)}
              className={`px-3 py-1 text-sm rounded-full ${
                securitySettings.suspiciousActivityAlerts
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {securitySettings.suspiciousActivityAlerts ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveSecuritySettings}
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Security Settings'}
          </button>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="card">
        <h4 className="text-md font-medium text-gray-900 mb-4">Privacy & Data</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Data Export</p>
              <p className="text-sm text-gray-500">Download a copy of your data</p>
            </div>
            <button
              onClick={() => handleSecuritySettingChange('dataExport', true)}
              className="btn-secondary"
            >
              Export Data
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="text-sm font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button
              onClick={() => handleSecuritySettingChange('accountDeletion', true)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecuritySettings;




