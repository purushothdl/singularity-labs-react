// src/components/auth/UpdateProfileModal.tsx
import { useState, useEffect, Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../api/authService';
import type { UserUpdate } from '../../types/api';
import { FiX } from 'react-icons/fi';
import { Transition } from '@headlessui/react';
import { TimezoneCombobox } from '../common/TimeZoneCombobox';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpdateProfileModal = ({ isOpen, onClose }: ModalProps) => {
    const { user, updateUserContext } = useAuth();
    const [formData, setFormData] = useState<UserUpdate>({
        username: '',
        timezone: 'UTC',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<{ [key: string]: string } | null>(null);

    // When the modal opens, pre-fill the form with the current user's data
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username,
                timezone: user.timezone || 'UTC',
            });
            setError(null); // Clear previous errors when opening
        }
    }, [user, isOpen]);

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const updatedUser = await updateUser(formData);
            updateUserContext(updatedUser);
            onClose();
        } catch (err: any) {
            const errorDetail = err.response?.data?.detail;
            if (typeof errorDetail === 'object' && errorDetail !== null) {
                setError(errorDetail);
            } else {
                setError({ general: 'Failed to update profile. Please try again.' });
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <div className="relative z-50">
                {/* Overlay with fade */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                {/* Modal content with fade and scale */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div 
                                onClick={(e) => e.stopPropagation()}
                                // ENHANCED DESIGN: Gradient background, subtle ring, more padding
                                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-left align-middle shadow-xl transition-all ring-1 ring-white/10"
                            >
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Manage Your Profile</h2>
                                    <button 
                                        onClick={onClose} 
                                        className="text-slate-400 hover:bg-blue-600 hover:text-white rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors duration-200"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                                <hr className="border-slate-700 my-4" />

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#00d4ff]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="timezone" className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                                        {/* Timezone selection with searchable combobox */}
                                        <TimezoneCombobox 
                                            isOpen={isOpen}
                                            value={formData.timezone || ''}
                                            onChange={(value) => handleChange('timezone', value)}
                                        />
                                        {error?.timezone && <p className="text-sm text-red-500 mt-1">{error.timezone}</p>}
                                    </div>

                                    {error?.general && <p className="text-sm text-red-500 text-center">{error.general}</p>}

                                    <div className="flex justify-end gap-4 pt-4">
                                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-700/50 border border-transparent hover:border-slate-600 transition-colors">
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-5 py-2 bg-[#005AE0] text-white font-semibold rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-500 transition-colors"
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </div>
        </Transition>
    );
};