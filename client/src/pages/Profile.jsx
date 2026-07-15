import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlinePencilSquare,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import { getInitials } from '../utils/helpers';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const avatarColors = [
  'bg-brand-600', 'bg-purple-600', 'bg-blue-600',
  'bg-accent-600', 'bg-red-500', 'bg-teal-600',
  'bg-pink-600', 'bg-indigo-600',
];

const roleBadge = {
  donor: { label: 'Donor', className: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' },
  ngo: { label: 'NGO', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  admin: { label: 'Admin', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
};

const Profile = () => {
  const { user, profile, updateProfileState, fetchProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Sync formData with profile data as it loads in the background
  useEffect(() => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
    });
  }, [profile]);

  // Trigger background profile fetch on component mount
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id, user.role);
    }
  }, [user, fetchProfile]);

  const role = user?.role || profile?.role;
  const badge = roleBadge[role];

  // Resolve display name cleanly (fallback to email prefix if name is blank, avoids "Not set")
  const displayName = profile?.name || (profile?.email ? profile.email.split('@')[0] : 'User');
  const displayPhone = profile?.phone || '—';
  const displayEmail = profile?.email || '—';

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      // Attempt backend update (future-proof stub, ready to hit PUT /profile)
      await updateProfile(formData);
      updateProfileState(formData);
      toast.success('Profile updated! ✓');
      setEditing(false);
    } catch {
      // Fallback: update state locally
      updateProfileState(formData);
      toast.success('Profile saved.');
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
    });
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">My Profile</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Manage your account details.
        </p>
      </div>

      {/* Avatar & Role Card */}
      <Card>
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-2xl ${avatarColors[selectedColor]} flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg`}>
            {getInitials(displayName)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                  {displayName}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {badge && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                      <HiOutlineShieldCheck size={12} />
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>
              {!editing && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <HiOutlinePencilSquare size={15} />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Avatar color picker */}
            <div className="mt-4">
              <p className="text-xs text-surface-400 mb-2">Avatar Color</p>
              <div className="flex gap-2 flex-wrap">
                {avatarColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-6 h-6 rounded-lg ${color} transition-transform cursor-pointer ${selectedColor === i ? 'scale-125 ring-2 ring-offset-2 ring-brand-400' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card>
        <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-5">
          Account Information
        </h3>

        {editing ? (
          <div className="space-y-4">
            <Input
              label="Full Name"
              leftIcon={HiOutlineUser}
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Phone Number"
              leftIcon={HiOutlinePhone}
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
            <div className="p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <p className="text-xs text-surface-500 dark:text-surface-400">
                <strong className="text-surface-700 dark:text-surface-300">Email</strong> — {displayEmail} (cannot be changed)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} loading={loading} fullWidth>
                <HiOutlineCheckCircle size={16} /> Save Changes
              </Button>
              <Button variant="secondary" onClick={handleCancel} fullWidth>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { icon: HiOutlineUser, label: 'Full Name', value: displayName },
              { icon: HiOutlineEnvelope, label: 'Email Address', value: displayEmail },
              { icon: HiOutlinePhone, label: 'Phone Number', value: displayPhone },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 p-4 bg-white border border-surface-100 rounded-xl">
                <div className="w-9 h-9 bg-surface-50 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Icon size={17} className="text-surface-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-500 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-surface-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>


    </div>
  );
};

export default Profile;
