import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  FileText, 
  Users,
  Send,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ProjectRequestForm {
  projectName: string;
  description: string;
  budget: string;
  timeline: string;
  category: string;
  skills: string[];
  additionalRequirements: string;
}

function ProjectRequest() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectRequestForm>();

  const skillOptions = [
    'Web Development', 'Mobile Development', 'UI/UX Design', 
    'Graphic Design', 'Content Writing', 'Digital Marketing',
    'SEO', 'Social Media Management', 'Video Editing',
    'Data Analysis', 'Project Management', 'Consulting'
  ];

  const categoryOptions = [
    'Website Development', 'Mobile App', 'Design & Branding',
    'Marketing & SEO', 'Content Creation', 'Business Consulting',
    'Technical Support', 'Other'
  ];

  const timelineOptions = [
    '1-2 weeks', '1 month', '2-3 months', '3-6 months', '6+ months'
  ];

  const budgetOptions = [
    'Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000',
    '$10,000 - $25,000', '$25,000 - $50,000', '$50,000+'
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const onSubmit = async (data: ProjectRequestForm) => {
    try {
      const projectRequest = {
        ...data,
        skills: selectedSkills,
        clientId: currentUser?.id,
        clientName: currentUser?.name,
        clientEmail: currentUser?.email,
        status: 'pending',
        createdAt: new Date(),
        id: Date.now().toString(),
      };

      // In a real app, you'd save this to Firebase
      console.log('Project Request:', projectRequest);
      
      toast.success('Project request submitted successfully!');
      setShowForm(false);
      reset();
      setSelectedSkills([]);
    } catch (error: any) {
      toast.error('Failed to submit project request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Requests</h1>
          <p className="text-gray-600">Submit new project requests and track their status.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project Request
        </button>
      </div>

      {/* Project Request Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">New Project Request</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="h-4 w-4 inline mr-1" />
                    Project Name
                  </label>
                  <input
                    {...register('projectName', { required: 'Project name is required' })}
                    className="input-field"
                    placeholder="Enter project name"
                  />
                  {errors.projectName && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Category
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Project Description
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="input-field"
                    placeholder="Describe your project requirements, goals, and any specific features you need..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Budget and Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Budget Range
                    </label>
                    <select
                      {...register('budget', { required: 'Budget is required' })}
                      className="input-field"
                    >
                      <option value="">Select budget range</option>
                      {budgetOptions.map(budget => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Timeline
                    </label>
                    <select
                      {...register('timeline', { required: 'Timeline is required' })}
                      className="input-field"
                    >
                      <option value="">Select timeline</option>
                      {timelineOptions.map(timeline => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                    {errors.timeline && (
                      <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
                    )}
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-1" />
                    Required Skills
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skillOptions.map(skill => (
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    {...register('additionalRequirements')}
                    rows={3}
                    className="input-field"
                    placeholder="Any additional requirements, preferences, or notes..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Requests List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Project Requests</h3>
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No project requests yet.</p>
          <p className="text-sm">Create your first project request to get started.</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectRequest;
