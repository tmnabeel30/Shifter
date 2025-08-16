import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Building, 
  Shield, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface OnboardingForm {
  name: string;
  company?: string;
  phone?: string;
  website?: string;
  role: 'client' | 'admin';
  projectName?: string;
  projectDescription?: string;
  budget?: number;
  timeline?: string;
}

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<'client' | 'admin' | null>(null);
  const { currentUser, updateUserRole, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OnboardingForm>();

  const watchedRole = watch('role');

  const steps = [
    { id: 1, title: 'Welcome', description: 'Let\'s get you started' },
    { id: 2, title: 'Choose Access Type', description: 'Select your role' },
    { id: 3, title: 'Profile Setup', description: 'Tell us about yourself' },
    { id: 4, title: selectedRole === 'client' ? 'Project Details' : 'Company Setup', description: selectedRole === 'client' ? 'Describe your project' : 'Set up your company' },
    { id: 5, title: 'Complete', description: 'You\'re all set!' },
  ];

  const handleRoleSelect = (role: 'client' | 'admin') => {
    setSelectedRole(role);
    setCurrentStep(3);
  };

  const onSubmit = async (data: OnboardingForm) => {
    try {
      await updateUserRole(data.role);
      await completeOnboarding();

      toast.success('Onboarding completed successfully!');
      setCurrentStep(5);

      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast.error('Failed to complete onboarding');
    }
  };

  const renderStep1 = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
        <User className="h-8 w-8 text-primary-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to Shifter!</h2>
        <p className="text-gray-600 mt-2">
          We're excited to have you on board. Let's set up your account and get you started.
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Current User:</strong> {currentUser?.email}
        </p>
      </div>
      <button
        onClick={() => setCurrentStep(2)}
        className="btn-primary flex items-center mx-auto"
      >
        Get Started
        <ArrowRight className="h-4 w-4 ml-2" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Access Type</h2>
        <p className="text-gray-600 mt-2">
          Select the type of access that best describes your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Option */}
        <div 
          className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRole === 'client' ? 'ring-2 ring-primary-500 bg-primary-50' : ''
          }`}
          onClick={() => handleRoleSelect('client')}
        >
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Client Access</h3>
              <p className="text-sm text-gray-600 mt-1">
                I want to hire freelancers and manage projects
              </p>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Submit project requests
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Track project progress
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Manage invoices and payments
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Access project files and updates
              </li>
            </ul>
          </div>
        </div>

        {/* Admin Option */}
        <div 
          className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedRole === 'admin' ? 'ring-2 ring-primary-500 bg-primary-50' : ''
          }`}
          onClick={() => handleRoleSelect('admin')}
        >
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Admin Access</h3>
              <p className="text-sm text-gray-600 mt-1">
                I want to manage the platform and team
              </p>
            </div>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Manage all projects and clients
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Access analytics and reports
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Configure system settings
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Manage team permissions
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="btn-secondary flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile Setup</h2>
        <p className="text-gray-600 mt-2">
          Tell us a bit more about yourself
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Full Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="input-field"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Company Name
            </label>
            <input
              {...register('company')}
              className="input-field"
              placeholder="Enter company name (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <input
              {...register('phone')}
              className="input-field"
              placeholder="Enter phone number (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="h-4 w-4 inline mr-1" />
              Website
            </label>
            <input
              {...register('website')}
              className="input-field"
              placeholder="Enter website URL (optional)"
            />
          </div>
        </div>

        <input type="hidden" {...register('role')} value={selectedRole || ''} />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <button type="submit" className="btn-primary flex items-center">
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedRole === 'client' ? 'Project Details' : 'Company Setup'}
        </h2>
        <p className="text-gray-600 mt-2">
          {selectedRole === 'client' 
            ? 'Tell us about your project requirements' 
            : 'Set up your company information'
          }
        </p>
      </div>
      
      {selectedRole === 'client' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Project Name
            </label>
            <input
              {...register('projectName')}
              className="input-field"
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description
            </label>
            <textarea
              {...register('projectDescription')}
              rows={4}
              className="input-field"
              placeholder="Describe your project requirements..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                {...register('budget')}
                className="input-field"
              >
                <option value="">Select budget range</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000+">$25,000+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline
              </label>
              <select
                {...register('timeline')}
                className="input-field"
              >
                <option value="">Select timeline</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="1-month">1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="3+months">3+ months</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Company Size
            </label>
            <select className="input-field">
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="200+">200+ employees</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select className="input-field">
              <option value="">Select industry</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="btn-secondary flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        <button
          onClick={() => setCurrentStep(5)}
          className="btn-primary flex items-center"
        >
          Complete Setup
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome aboard!</h2>
        <p className="text-gray-600 mt-2">
          Your account has been set up successfully. You're now ready to start using Shifter.
        </p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Access Type:</strong> {selectedRole === 'client' ? 'Client' : 'Admin'}
        </p>
      </div>
      <div className="text-sm text-gray-600">
        Redirecting to dashboard...
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.id 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
